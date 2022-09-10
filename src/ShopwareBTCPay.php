<?php declare(strict_types=1);

namespace Coincharge\ShopwareBTCPay;

use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\ActivateContext;
use Shopware\Core\Framework\Plugin\Context\DeactivateContext;
use Shopware\Core\Framework\Plugin\Context\InstallContext;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;
use Shopware\Core\Framework\Plugin\Util\PluginIdProvider;
use Shopware\Core\System\CustomField\CustomFieldTypes;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Content\Media\File\MediaFile;
use Shopware\Core\Content\Media\MediaEntity;

use Coincharge\ShopwareBTCPay\Service\BTCPayPayment;

class  ShopwareBTCPay extends Plugin
{
	public function install(InstallContext $context): void
    {
        $customFieldSetRepository = $this->container->get('custom_field_set.repository');
    
            $customFieldSetRepository->upsert([
                [
                    'name' => 'btcpayServer',
                    // 'global' => true,
                    'config' => [
                        'label' => [
                            'de-DE' => 'BTCPayServer Information',
                            'en-GB' => 'BTCPayServer Information'
                        ]
                    ],
                    'customFields' => [
                        [
                            'name' => 'btcpayOrderStatus',
                            'label' => 'Order Status',
                            'type' => CustomFieldTypes::TEXT,
                            'config' => [
                                'label' => [
                                    'de-DE' => 'Auftragsstatus',
                                    'en-GB' => 'Order Status'
                                ]
                            ]
                        ],
                        [
                            'name' => 'paymentMethod',
                            'label' => 'Payment Method',
                            'type' => CustomFieldTypes::TEXT,
                            'config' => [
                                'label' => [
                                    'de-DE' => 'Zahlungsmethode',
                                    'en-GB' => 'Payment Method'
                                ]
                            ]
                        ],
                        [
                            'name' => 'paidAfterExpiration',
                            'label' => 'Paid After Expiration',
                            'type' => CustomFieldTypes::BOOL,
                            'config' => [
                                'label' => [
                                    'de-DE' => 'Bezahlt nach Ablauf der Rechnung',
                                    'en-GB' => 'Paid After Invoice Expiration'
                                ]
                            ]
                        ],
                        [
                            'name' => 'overpaid',
                            'label' => 'Received more than expected',
                            'type' => CustomFieldTypes::BOOL,
                            'config' => [
                                'label' => [
                                    'de-DE' => 'Überbezahlt',
                                    'en-GB' => 'Overpaid '
                                ]
                            ]
                        ],
                    ],
                    'relations' => [[
                        'entityName' => 'order'
                    ]],
                ]
            ], $context->getContext()); 
        $this->addPaymentMethod($context->getContext());
    }

    public function uninstall(UninstallContext $context): void
    {
        // Only set the payment method to inactive when uninstalling. Removing the payment method would
        // cause data consistency issues, since the payment method might have been used in several orders
        $this->setPaymentMethodIsActive(false, $context->getContext());
    }

    public function activate(ActivateContext $context): void
    {
        $this->setPaymentMethodIsActive(true, $context->getContext());
        parent::activate($context);
    }

    public function deactivate(DeactivateContext $context): void
    {
        $this->setPaymentMethodIsActive(false, $context->getContext());
        parent::deactivate($context);
    }

    private function addPaymentMethod(Context $context): void
    {
        $paymentMethodExists = $this->getPaymentMethodId();

        // Payment method exists already, no need to continue here
        if ($paymentMethodExists) {
            return;
        }

        /** @var PluginIdProvider $pluginIdProvider */
        $pluginIdProvider = $this->container->get(PluginIdProvider::class);
        $pluginId = $pluginIdProvider->getPluginIdByBaseClass(get_class($this), $context);

        $examplePaymentData = [
            // payment handler will be selected by the identifier
            'handlerIdentifier' => BTCPayPayment::class,
            'pluginId' => $pluginId,
            'mediaId' => $this->ensureMedia(),
            'translations' => [
                'de-DE' => [
                    'name' => 'Coincharge-Zahlung',
                    'description' => 'Zahlen mit Bitcoin'
                ],
                'en-GB' => [
                    'name' => 'Coincharge payment',
                    'description' => 'Pay with Bitcoin'
                ],
            ],
        ];

        /** @var EntityRepositoryInterface $paymentRepository */
        $paymentRepository = $this->container->get('payment_method.repository');
        $paymentRepository->create([$examplePaymentData], $context);
    }

    private function setPaymentMethodIsActive(bool $active, Context $context): void
    {
        /** @var EntityRepositoryInterface $paymentRepository */
        $paymentRepository = $this->container->get('payment_method.repository');

        $paymentMethodId = $this->getPaymentMethodId();

        // Payment does not even exist, so nothing to (de-)activate here
        if (!$paymentMethodId) {
            return;
        }

        $paymentMethod = [
            'id' => $paymentMethodId,
            'active' => $active,
        ];

        $paymentRepository->update([$paymentMethod], $context);
    }

    private function getPaymentMethodId(): ?string
    {
        /** @var EntityRepositoryInterface $paymentRepository */
        $paymentRepository = $this->container->get('payment_method.repository');

        // Fetch ID for update
        $paymentCriteria = (new Criteria())->addFilter(new EqualsFilter('handlerIdentifier', BTCPayPayment::class));
        return $paymentRepository->searchIds($paymentCriteria, Context::createDefaultContext())->firstId();
    }
    private function getMediaEntity(string $fileName): ?MediaEntity
    {
        $criteria = new Criteria();
        $criteria->addFilter(new EqualsFilter('fileName', $fileName));

        return $this->mediaRepository->search($criteria, $this->context)->first();
    }
    private function ensureMedia(): string
    {
        $filePath = realpath(__DIR__ . '/../Resources/config/plugin.png');
        $fileName = hash_file('md5', $filePath);
        $media = $this->getMediaEntity($fileName);
        if ($media) {
            return $media->getId();
        }

        $mediaFile = new MediaFile(
            $filePath,
            mime_content_type($filePath),
            pathinfo($filePath, PATHINFO_EXTENSION),
            filesize($filePath)
        );
        $mediaId = Uuid::randomHex();
        $this->mediaRepository->create([
            [
                'id' => $mediaId,
            ],
        ], $this->context);

        $this->fileSaver->persistFileToMedia(
            $mediaFile,
            $fileName,
            $mediaId,
            $this->context
        );

        return $mediaId;
    }
}
