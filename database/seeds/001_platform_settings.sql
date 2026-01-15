-- Seed data for platform settings

INSERT INTO platform_settings (key, value, description) VALUES
('platform_commission_rate', '{"rate": 0.15, "type": "percentage"}', 'Platform commission rate (15%)'),
('minimum_wallet_balance', '{"amount": 10.00}', 'Minimum wallet balance required'),
('low_balance_threshold', '{"amount": 50.00}', 'Low balance warning threshold'),
('low_balance_warning_seconds', '{"seconds": 30}', 'Seconds before call termination when balance is low'),
('session_timeout_minutes', '{"minutes": 60}', 'Maximum session duration in minutes'),
('lawyer_verification_required', '{"required": true}', 'Whether lawyer verification is mandatory'),
('subscription_plans', '{"monthly": {"price": 299, "duration_days": 30}, "quarterly": {"price": 799, "duration_days": 90}, "annual": {"price": 2499, "duration_days": 365}}', 'Subscription plan pricing')
ON CONFLICT (key) DO NOTHING;
