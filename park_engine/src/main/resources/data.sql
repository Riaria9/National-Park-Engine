INSERT INTO MY_USER (ID, HASHED_PASSWORD, PRIVACY_STATUS, SALT, USERNAME)
VALUES
    (1, '0147194c6c13fcd5a7e3fd0f8ff15b9d37499e20cccfc2f88b174aa1c9d2351d', FALSE, '[24, 57, 31, -76, -30, -99, 39, 6, -24, 28, 55, 16, -80, -73, 82, -67]', 'clrIjfJY0ZKxn28lrvA9SA=='),
    (2, '07482b1d79fe67111353a7ce44c1eaa86fb2e92ac17acc22ed4f523d68d7e691', TRUE, '[99, 98, -79, 72, -59, -29, -110, 78, 86, 36, -58, 82, -79, -127, 117, -109]', 'lvEzmME+10m1nUogi/UVtw=='),
    (3, 'e52538e61a05ff976ff12b345ced3f564196e4fd998fd31c169d93c56f248d2a', FALSE, '[61, -85, 91, -107, 67, -63, 20, -29, -93, -104, -21, -34, 53, 127, -125, -93]', '8/cf+tj4W42M3YPEsYw2Og=='),
    (4, 'b9a091163ae5a622040febaf6306fc662668eeb82398641ce23323367145d480', TRUE, '[-6, 54, 66, -20, -92, -83, -64, 115, 99, 30, 119, -125, 86, -118, -96, 43]', 'Lt26sbT3RDaR1xFBp1VtUw=='),
    (5, 'df167db84b94e349eaee6a8acfb86ebcd1eef6c7797476ec658d81d56907faee', FALSE, '[-102, -109, 13, -59, -92, -94, 12, 91, 32, -44, 64, 78, -86, -103, -24, 0]', 'ZfxKc15xDRBBSZdECI9MVQ=='),
    (6, 'b06cb46fab94c64bd2951ef51c8680ccbe9add87fae4c77a1ed62d24d28125fe', TRUE, '[-33, 4, -27, 90, 13, 117, 7, -36, 5, -107, 115, -59, 38, -75, 60, 114]', 'ebjQ74gjgaZuW4Wh9BYoKg==');

INSERT INTO FAVORITE (ID, USERNAME)
VALUES
    (1, 'existUser'),
    (2, 'searchUser'),
    (3, 'compareUser'),
    (4, 'favUser'),
    (5, 'publicUser'),
    (6, 'privateUser');

INSERT INTO FAVORITE_PARK_CODES (FAVORITE_ID, PARK_CODES)
VALUES
    (1, 'yell'),
    (2, 'brca'),
    (3, 'brca'),
    (3, 'yell'),
    (4, 'grca'),
    (4, 'yell'),
    (4, 'brca');
