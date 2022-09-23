<?php

declare(strict_types=1);

namespace Coincharge\Shopware\Service;

use Shopware\Core\System\SystemConfig\SystemConfigService;

class ConfigurationService
{
    protected CONST DOMAIN = 'BTCPay.config.';
    /**
     * @var SystemConfigService
     */
    private SystemConfigService $systemConfigService;

    /**
     * @param SystemConfigService $systemConfigService
     */
    public function __construct(SystemConfigService $systemConfigService)
    {
        $this->systemConfigService = $systemConfigService;
    }

    public function getSetting(string $setting, ?string $salesChannelId = null)
    {
        return $this->systemConfigService->get(self::DOMAIN . $setting, $salesChannelId);
    }
    public function setSetting(string $setting, $value, ?string $salesChannelId = null)
    {
        return $this->systemConfigService->set(self::DOMAIN . $setting, $value, $salesChannelId);
    }
    public function getShopName(?string $salesChannelId): string
    {
        return $this->systemConfigService->get("core.basicInformation.shopName");
    }
}
