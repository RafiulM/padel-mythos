-- Padelin demo seed data
-- Dialect: MySQL / MariaDB-compatible MySQL mode
--
-- Demo owner login:
--   email:    owner@padelin.test
--   password: password123
--
-- Run after sql/migrate.sql. The inserts are idempotent.

SET @seed_user_id = '11111111-1111-4111-8111-111111111111';
SET @demo_user_id = @seed_user_id;
SET @demo_account_id = '22222222-2222-4222-8222-222222222222';

SET @venue_senayan_id = '33333333-3333-4333-8333-333333333333';
SET @venue_bekasi_id = '44444444-4444-4444-8444-444444444444';

SET @senayan_court_a_id = '55555555-5555-4555-8555-555555555555';
SET @senayan_court_b_id = '66666666-6666-4666-8666-666666666666';
SET @senayan_court_c_id = '77777777-7777-4777-8777-777777777777';
SET @bekasi_court_1_id = '88888888-8888-4888-8888-888888888888';
SET @bekasi_court_2_id = '99999999-9999-4999-8999-999999999999';

INSERT INTO `user` (
  `id`,
  `name`,
  `email`,
  `email_verified`,
  `image`,
  `created_at`,
  `updated_at`
) VALUES (
  @seed_user_id,
  'Demo Owner',
  'owner@padelin.test',
  false,
  NULL,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
) ON DUPLICATE KEY UPDATE
  `name` = VALUES(`name`),
  `email_verified` = VALUES(`email_verified`),
  `updated_at` = CURRENT_TIMESTAMP(3);

SELECT `id` INTO @demo_user_id
FROM `user`
WHERE `email` = 'owner@padelin.test'
LIMIT 1;

DELETE FROM `account`
WHERE `user_id` = @demo_user_id
  AND `provider_id` = 'credential'
  AND `id` <> @demo_account_id;

INSERT INTO `account` (
  `id`,
  `account_id`,
  `provider_id`,
  `user_id`,
  `password`,
  `created_at`,
  `updated_at`
) VALUES (
  @demo_account_id,
  @demo_user_id,
  'credential',
  @demo_user_id,
  '3f2bdfc2ac5c57748ad6a54492093c45:aa2124e9dd596386655fc81f370ea5aaa55b739d3a5264137b309a2d125ad9c13c3cfba4e842420fa91e46b99e6552219e9d1f2633690e207cb295e83f7772f7',
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
) ON DUPLICATE KEY UPDATE
  `account_id` = VALUES(`account_id`),
  `provider_id` = VALUES(`provider_id`),
  `user_id` = VALUES(`user_id`),
  `password` = VALUES(`password`),
  `updated_at` = CURRENT_TIMESTAMP(3);

INSERT INTO `venues` (
  `id`,
  `tenant_id`,
  `name`,
  `slug`,
  `address`,
  `whatsapp`,
  `open_hour`,
  `close_hour`,
  `bank_name`,
  `bank_number`,
  `bank_holder`,
  `qris_url`,
  `payment_notes`
) VALUES
  (
    @venue_senayan_id,
    @demo_user_id,
    'Padel Senayan',
    'padel-senayan',
    'Jl. Asia Afrika No. 8, Jakarta Pusat',
    '6281234567890',
    7,
    22,
    'BCA',
    '8830112345',
    'PT Padel Senayan Jaya',
    NULL,
    'Transfer tepat sesuai nominal agar admin mudah melakukan verifikasi.'
  ),
  (
    @venue_bekasi_id,
    @demo_user_id,
    'Padel Bekasi',
    'padel-bekasi',
    'Jl. Ahmad Yani No. 12, Bekasi',
    '6281298765432',
    8,
    22,
    'Mandiri',
    '1330022334455',
    'CV Padel Bekasi',
    NULL,
    'Kirim bukti pembayaran melalui WhatsApp venue setelah transfer.'
  )
ON DUPLICATE KEY UPDATE
  `tenant_id` = VALUES(`tenant_id`),
  `name` = VALUES(`name`),
  `address` = VALUES(`address`),
  `whatsapp` = VALUES(`whatsapp`),
  `open_hour` = VALUES(`open_hour`),
  `close_hour` = VALUES(`close_hour`),
  `bank_name` = VALUES(`bank_name`),
  `bank_number` = VALUES(`bank_number`),
  `bank_holder` = VALUES(`bank_holder`),
  `qris_url` = VALUES(`qris_url`),
  `payment_notes` = VALUES(`payment_notes`);

INSERT INTO `courts` (
  `id`,
  `venue_id`,
  `name`,
  `type`,
  `price_per_hour`
) VALUES
  (@senayan_court_a_id, @venue_senayan_id, 'Court A', 'Indoor', 250000),
  (@senayan_court_b_id, @venue_senayan_id, 'Court B', 'Indoor', 250000),
  (@senayan_court_c_id, @venue_senayan_id, 'Court C', 'Outdoor', 200000),
  (@bekasi_court_1_id, @venue_bekasi_id, 'Court 1', 'Indoor', 180000),
  (@bekasi_court_2_id, @venue_bekasi_id, 'Court 2', 'Outdoor', 150000)
ON DUPLICATE KEY UPDATE
  `venue_id` = VALUES(`venue_id`),
  `name` = VALUES(`name`),
  `type` = VALUES(`type`),
  `price_per_hour` = VALUES(`price_per_hour`);

INSERT INTO `bookings` (
  `id`,
  `code`,
  `court_id`,
  `customer_name`,
  `customer_wa`,
  `date`,
  `start_hour`,
  `duration`,
  `total_price`,
  `status`,
  `notes`
) VALUES
  (
    'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'PDL-8F2KQ',
    @senayan_court_a_id,
    'Rizky Maulana',
    '081234567890',
    CURDATE(),
    15,
    2,
    500000,
    'PENDING',
    'Sewa raket 2 buah'
  ),
  (
    'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
    'PDL-3JD7A',
    @senayan_court_b_id,
    'Sarah Putri',
    '081298761234',
    CURDATE(),
    18,
    1,
    250000,
    'PAID',
    NULL
  ),
  (
    'aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3',
    'PDL-9QPL2',
    @senayan_court_a_id,
    'Andi Wijaya',
    '085712340987',
    CURDATE(),
    19,
    2,
    500000,
    'PAID',
    NULL
  ),
  (
    'aaaaaaa4-aaaa-4aaa-8aaa-aaaaaaaaaaa4',
    'PDL-5TXR8',
    @senayan_court_c_id,
    'Bima Sakti',
    '081377788899',
    CURDATE(),
    9,
    1,
    200000,
    'COMPLETED',
    NULL
  ),
  (
    'aaaaaaa5-aaaa-4aaa-8aaa-aaaaaaaaaaa5',
    'PDL-2MN4V',
    @senayan_court_a_id,
    'Citra Lestari',
    '081555666777',
    CURDATE(),
    8,
    1,
    250000,
    'CANCELLED',
    'Dibatalkan pelanggan'
  ),
  (
    'aaaaaaa6-aaaa-4aaa-8aaa-aaaaaaaaaaa6',
    'PDL-7HW3Z',
    @senayan_court_b_id,
    'Dewi Anggraini',
    '081222333444',
    DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    17,
    2,
    500000,
    'PENDING',
    NULL
  ),
  (
    'aaaaaaa7-aaaa-4aaa-8aaa-aaaaaaaaaaa7',
    'PDL-4KC9B',
    @senayan_court_a_id,
    'Fajar Nugroho',
    '085699887766',
    DATE_ADD(CURDATE(), INTERVAL 2 DAY),
    20,
    1,
    250000,
    'PAID',
    NULL
  ),
  (
    'bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'PDL-6RT2M',
    @bekasi_court_1_id,
    'Gilang Pratama',
    '081311122233',
    CURDATE(),
    16,
    2,
    360000,
    'PENDING',
    NULL
  ),
  (
    'bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    'PDL-1VB8X',
    @bekasi_court_2_id,
    'Hana Safitri',
    '082144455566',
    CURDATE(),
    19,
    1,
    150000,
    'PAID',
    NULL
  ),
  (
    'bbbbbbb3-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    'PDL-9ZC3D',
    @bekasi_court_1_id,
    'Iqbal Ramadhan',
    '081377711100',
    DATE_ADD(CURDATE(), INTERVAL 1 DAY),
    10,
    2,
    360000,
    'PAID',
    'Turnamen kecil'
  )
ON DUPLICATE KEY UPDATE
  `court_id` = VALUES(`court_id`),
  `customer_name` = VALUES(`customer_name`),
  `customer_wa` = VALUES(`customer_wa`),
  `date` = VALUES(`date`),
  `start_hour` = VALUES(`start_hour`),
  `duration` = VALUES(`duration`),
  `total_price` = VALUES(`total_price`),
  `status` = VALUES(`status`),
  `notes` = VALUES(`notes`);
