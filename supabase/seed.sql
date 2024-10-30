insert into
    public.pubs (
        id,
        created_at,
        updated_at,
        name,
        address,
        phone_number,
        description,
        google_id,
        website,
        location
    )
values
    (
        61,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'London Wedding Bars',
        '411 Mare St, London E8 1HY, UK',
        '020 3603 1084',
        'Lorem ipsum',
        'ChIJ30luR7UddkgR3lon*brVZ-A',
        'http://www.londonweddingbars.com/?utm_source=GMB&utm_medium=organic&utm_campaign=office',
        '0101000020E6100000D46DF5413B4CACBF6CDB9CEF4CC64940'
    ),
    (
        58,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Happy Vaper Cafe',
        '100 Lower Clapton Rd, Lower Clapton, London E5 0QR, UK',
        '020 8985 8699',
        'Lorem ipsum',
        'ChIJ7wYVNPkcdkgRFInKFtpT91o',
        'https://www.thehappyvaper.co.uk/',
        '0101000020E6100000560ACBE9FC25ABBFA3486359D5C64940'
    ),
    (
        57,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Biddle Bros',
        '88 Lower Clapton Rd, Lower Clapton, London E5 0QR, UK',
        '07738 100000',
        'Little pub & music spot behind an unassuming storefront featuring live bands & a convivial vibe.',
        'ChIJI6vuMfkcdkgRwiPe_q4geZ4',
        'https://www.facebook.com/biddlebros',
        '0101000020E6100000F5238FF17222ABBF9224AD9DCDC64940'
    ),
    (
        43,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'P Franco',
        '107 Lower Clapton Rd, Lower Clapton, London E5 0NP, UK',
        '020 8533 4660',
        'Snug, trendy bar & bottle shop with a communal table & rotating chefs turning out diverse nibbles.',
        'ChIJKVm0rv4cdkgR8bD1JUr-SHY',
        'http://pfranco.co.uk/',
        '0101000020E61000008F76DCF0BBE9AABFDEACC1FBAAC64940'
    ),
    (
        39,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Paper Dress Vintage',
        '352a Mare St, London E8 1JB, UK',
        '020 8510 0520',
        'Stylish boutique for vintage British fashions for women and men, plus evening bar with live music.',
        'ChIJGfZUnLocdkgRGn_TKi4O0WM',
        'http://www.paperdressvintage.co.uk/',
        '0101000020E6100000047EF9090CFEABBF6F6AFBB20FC64940'
    ),
    (
        41,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Clapton Hart',
        '231 Lower Clapton Rd, Lower Clapton, London E5 8EH, UK',
        '020 8985 8124',
        'Massive venue with a stylishly downtrodden feel, a terrace and a range of hard-to-find craft beers.',
        'ChIJHR4pfPgcdkgRZRSlOZj1q4A',
        'http://www.claptonhart.com/',
        '0101000020E6100000CF7FFE3163C0ACBFD2DAD9FC64C74940'
    ),
    (
        42,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Venerdi',
        '9 Chatsworth Rd, London E5 0LH, UK',
        '020 8533 1902',
        'Easygoing Italian restaurant with floor-to-ceiling windows and pavement tables, plus takeaway.',
        'ChIJMRFIgAEddkgRoqhAIJaheJk',
        'http://www.venerdi.co.uk/',
        '0101000020E610000037FE4465C39AA6BF7A6FC273A5C64940'
    ),
    (
        62,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Hackney Coterie Restaurant',
        '230B Dalston Ln, London E8 1LA, UK',
        '020 7254 4101',
        'Lorem ipsum',
        'ChIJXzRccNYddkgRAgvx57UGXi4',
        'https://www.hackneycoterie.net/?utm_source=GMB&utm_medium=website+click&utm_campaign=SDM&utm_id=GMB',
        '0101000020E610000075B6DB89ED49AFBF01F9122A38C64940'
    ),
    (
        63,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Hackney Tap',
        '354 Mare St, London E8 1HR, UK',
        '020 3026 4373',
        'Craft beers pair with handmade Japanese gyoza at this charming pub in a 19th-century building.',
        'ChIJDxpYEgwddkgR1gIjmWIC98M',
        'http://www.hackneytap.com/',
        '0101000020E6100000941DD1F35D00ACBFC223E0C61CC64940'
    ),
    (
        44,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Vincent',
        '2, Atkins Square, Dalston Ln, Lower Clapton, London E8 1FN, UK',
        '020 8510 0423',
        'Brunch & burgers with vegan options, plus craft beers, in bright, plant-filled surrounds.',
        'ChIJz9DFefocdkgRs_O0KPe1aOw',
        'http://www.thevincent-e8.com/',
        '0101000020E61000005926A199CC1DAEBF06CD429660C64940'
    ),
    (
        45,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Crown Pub & Guesthouse',
        '418 Mare St, London E8 1HP, UK',
        '020 8533 0372',
        'Traditional sports pub with a modern greenhouse-style outdoor bar & adjoining boutique guesthouse.',
        'ChIJm9rZpvscdkgRN2vzRBKuZVA',
        'http://www.thecrownhackney.co.uk/',
        '0101000020E610000088EEFE1DF6E7ABBFC12A285657C64940'
    ),
    (
        40,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Pembury Tavern',
        '90 Amhurst Rd, London E8 1JH, UK',
        '020 8986 8597',
        'Pub offering board games and a bar billiards table, with a menu of Italian dishes and pizzas.',
        'ChIJoYQEhvAcdkgRQrz3O6jLA-g',
        'http://pemburytavern.co.uk/',
        '0101000020E6100000701D88D11852AEBF5281EE2653C64940'
    ),
    (
        60,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'A Slice of Blue',
        '43 Lower Clapton Rd, Lower Clapton, London E5 0NS, UK',
        '020 8533 3301',
        'Lorem ipsum',
        'ChIJgZPg8hcddkgRtczuPWJbd1A',
        'http://www.asliceofblue.com/',
        '0101000020E6100000E3FDB8FDF2C9AABFE075EC5685C64940'
    ),
    (
        38,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Old Ship Hackney',
        '2 Sylvester Path, London E8 1EN, UK',
        '020 8986 2732',
        'Victorian pub with a traditional British menu & bright, chic guestrooms with free breakfast.',
        'ChIJJ4w-1uQcdkgRob3JzA4qots',
        'https://www.oldshiphackney.com/?utm_source=gmb&utm_medium=organic&utm_campaign=homepage',
        '0101000020E610000024FC8BA03193ACBFD0E4F626E1C54940'
    ),
    (
        46,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Behind This Wall',
        '411 Mare St, London E8 1HY, UK',
        '020 8985 3927',
        'Basement bar serving cocktails, beer and wine in a warm, relaxed space with a vintage sound system.',
        'ChIJJ4gR1sIcdkgRucVw69YPAZg',
        'https://www.behindthiswall.com/',
        '0101000020E6100000A5F386A00F3BACBF4BA35DE04DC64940'
    ),
    (
        47,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Oslo Hackney',
        '1A Amhurst Rd, London E8 1JB, UK',
        '020 3553 4831',
        'Restaurant and club in former railway station, for daytime snacks and an evening European menu.',
        'ChIJpS5_JfscdkgR1rMgegTCspM',
        'http://www.oslohackney.com/',
        '0101000020E6100000D84B09771D60ACBFF58E09E709C64940'
    ),
    (
        48,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Brew Club',
        'Arches 7-8 Hackney Walk, Bohemia Pl, London E8 1DU, UK',
        '020 3976 2361',
        'Lorem ipsum',
        'ChIJ-1fl_lYcdkgRZqp-KHWhh98',
        'http://www.brewclub.uk.com/',
        '0101000020E6100000112917748C75ABBFE2B54B1B0EC64940'
    ),
    (
        49,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'ABQ London',
        '18 Bohemia Pl, London E8 1DU, UK',
        '020 8076 9846',
        'Experimental chemical techniques are used to create the innovative drinks at this TV-inspired bar.',
        'ChIJPwE9FMMcdkgRUOqcU9Pvw6M',
        'http://abqlondon.com/',
        '0101000020E610000014200A664CC1AABF15A930B610C64940'
    ),
    (
        50,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Pressure Drop X Verdant The Experiment',
        'Unit 19, 19 Bohemia Pl, Mare St, London E8 1DU, UK',
        '020 8533 0614',
        'Pressure Drop & Verdant brewers come together to offer this hip tasting venue for fresh beers.',
        'ChIJ9aWFRfscdkgRb9_Ns8wQ8T4',
        'https://pressuredropbrewing.co.uk/pages/the-experiment-e8',
        '0101000020E6100000FBF4447CCCACAABF0E762F9C10C64940'
    ),
    (
        51,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Plough',
        '23-25 Homerton High St, London E9 6JP, UK',
        '020 8525 0592',
        'Local pub with hints of its previous life alongside modern design touches and a cocktail menu.',
        'ChIJ2ZClaP0cdkgR9ixSjGE_Weo',
        'http://www.theploughe9.com/',
        '0101000020E61000003C1856968D73A8BF482CCEBD2CC64940'
    ),
    (
        52,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Baxter’s Court',
        '282, 284 Mare St, London E8 1HE, UK',
        '020 8525 9010',
        'Modern hostelry with real ales, budget pub food, children''s'' menu and a courtyard space.',
        'ChIJfUjW5eQcdkgRiDSy-xdJM4s',
        'https://www.jdwetherspoon.com/pubs/all-pubs/england/london/baxters-court-hackney',
        '0101000020E6100000BF37E1B9522AACBF1A36CAFACDC54940'
    ),
    (
        53,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Hand of Glory',
        '240 Amhurst Rd, Lower Clapton, London E8 2BS, UK',
        '020 7249 7455',
        'Lorem ipsum',
        'ChIJK2u1A_UcdkgRbRNfuEvWIG0',
        'http://www.jaguarshoes.com/venues/hand-of-glory/',
        '0101000020E61000001592CCEA1D6EB1BF24DC1AC7FEC64940'
    ),
    (
        54,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Three Compasses, Dalston',
        '99 Dalston Ln, London E8 1NH, UK',
        '020 7923 4752',
        'Fashionable local with a beer terrace to the front and a regular list of live music and DJ nights.',
        'ChIJUUSU7vIcdkgRvyWixUFgifc',
        'http://www.3compasses.com/',
        '0101000020E610000066F8F47DDD8EB1BF656D533C2EC64940'
    ),
    (
        55,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Elderfield',
        '57 Elderfield Rd, Lower Clapton, London E5 0LF, UK',
        '020 8986 1591',
        'Lorem ipsum',
        'ChIJd_FJ3wEddkgR6YL3yqy0OJA',
        'http://theelderfield.co.uk/',
        '0101000020E6100000BBA54176830DA8BF62F14009D8C64940'
    ),
    (
        59,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Palaette',
        '415 Mare St, London E8 1HN, UK',
        '07395 327754',
        'Industrial-chic eatery with a terrace serving colorful standards & all-day brunch, plus cocktails.',
        'ChIJccLTGg4ddkgRWd4TurnlLO8',
        'http://www.palaette.co.uk/',
        '0101000020E6100000CCFFF51B3746ACBFEFDB5A7050C64940'
    ),
    (
        56,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Star By Hackney Downs',
        '35 Queensdown Rd, Lower Clapton, London E5 8JQ, UK',
        '020 7458 4481',
        'Trendy corner pub with a streetside terrace, craft beers and regular weekend DJ sessions until late.',
        'ChIJo4SkwvkcdkgRW-jcFyeXZNY',
        'http://starbyhackneydowns.co.uk/',
        '0101000020E61000009D024F102B92ADBF68D94933CCC64940'
    ),
    (
        64,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Hackney Church Brew Co.',
        '17 Bohemia Pl, London E9 6PB, UK',
        '020 3795 8295',
        'Lorem ipsum',
        'ChIJywGJqfQddkgRpJea-TZ_IZo',
        'http://hackneychurchbrew.co/',
        '0101000020E6100000D31C0F6C4BD3AABF2DEBFEB110C64940'
    ),
    (
        65,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Salamanca - Latin Cocktail Joint',
        '18 Bohemia Pl, London E8 1DU, UK',
        '020 8076 9846',
        'Lorem ipsum',
        'ChIJsXA-0PQddkgREEVAaPPG49o',
        'https://www.hackneyfunhouse.com/salamanca-cocktail-bar',
        '0101000020E6100000B8D210FA3EC1AABF2DEBFEB110C64940'
    ),
    (
        66,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Hackney Funhouse',
        '18 Bohemia Pl, London E8 1DU, UK',
        '020 8076 9846',
        'Lorem ipsum',
        'ChIJLW8LdE8ddkgR_SDOEpNt3X8',
        'https://www.hackneyfunhouse.com/',
        '0101000020E610000043D9A55714C0AABF2F8FDA6910C64940'
    ),
    (
        67,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Chesham Arms',
        'East London Public House, 15 Mehetabel Rd, London E9 6DU, UK',
        '020 8986 6717',
        'Cosy traditional pub with stripped floors and leafy beer garden, for real ales and a gastropub menu.',
        'ChIJpxNi3PwcdkgRixNM8IKk74U',
        'http://www.cheshamarms.com/',
        '0101000020E610000021EB048FCAA8A9BF1706D1FF17C64940'
    ),
    (
        68,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'MOTH Club',
        'Valette St, London E9 6NU, UK',
        '020 8985 7963',
        'An array of rotating music & comedy performances in a relaxed, homey setting with a full bar menu.',
        'ChIJ0yYfxOQcdkgRdfZT_zBt1cA',
        'http://www.mothclub.co.uk/',
        '0101000020E610000044D6BF907AF4ABBFE367C81DDBC54940'
    ),
    (
        69,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Empire Bar',
        '291 Mare St, London E8 1EJ, UK',
        '020 8985 2424',
        'Lorem ipsum',
        'ChIJWWl93uQcdkgR1Ikj-a_ZutA',
        'https://hackneyempire.co.uk/your-visit/food-drink/',
        '0101000020E61000005EF23FF9BB77ACBF5697AEBBD4C54940'
    ),
    (
        70,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Tram Store',
        '38 Upper Clapton Rd, London E5 8BQ, UK',
        '020 8806 5099',
        'Lorem ipsum',
        'ChIJrytbVVYcdkgRNnH4Kqwanzg',
        'http://www.tram-store.co.uk/',
        '0101000020E6100000C25ECDA6C8C6ACBFA243E048A0C74940'
    ),
    (
        71,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The London Tavern',
        '92 Rendlesham Rd, London E5 8PA, UK',
        '020 8986 0966',
        'Lorem ipsum',
        'ChIJ6THf6VgcdkgRl7E5UFc3Iwo',
        'https://the-london-tavern-pub.business.site/',
        '0101000020E6100000E8F9D346753AB0BF222933EF82C74940'
    ),
    (
        73,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Binch',
        '51 Greenwood Rd, London E8 1NT, UK',
        '020 7254 1319',
        'Lorem ipsum',
        'ChIJ8-kVBEgddkgR7G5FV4CcSfU',
        'http://www.binchlondon.com/',
        '0101000020E610000034EECD6F9868B0BFC97E2777E9C54940'
    ),
    (
        74,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Nobody Asked Me',
        '88 Chatsworth Rd, Lower Clapton, London E5 0LS, UK',
        '07723 398662',
        'Lorem ipsum',
        'ChIJ58bbE4oddkgRV-Wb2Kurslc',
        'http://nobodyaskedme.co.uk/',
        '0101000020E6100000138EC5DBEFF5A6BF8A141450F2C64940'
    ),
    (
        76,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Bar People',
        '3b Coppice Row, Theydon Bois, Epping CM16 7ES, UK',
        '07557 402200',
        'Lorem ipsum',
        'ChIJM9whyq6Y2EcRJQcgrpj9ikM',
        'http://www.thebarpeople.co.uk/',
        '0101000020E6100000A038807EDFBFB93F7AEC1D24FAD54940'
    ),
    (
        77,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Queen Victoria',
        'Coppice Row, Theydon Bois, Epping CM16 7ES, UK',
        '01992 812392',
        'Classic pub with country-style interior and menu of traditional British dishes, plus outside tables.',
        'ChIJfYgjuhyi2EcR1vOE3z7SSxY',
        'https://www.destinationinns.co.uk/pubs/queenvictoria/',
        '0101000020E61000007A0327367A90B93FE8DA17D00BD64940'
    ),
    (
        78,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Bull',
        'Station Approach, Theydon Bois, Epping CM16 7HR, UK',
        '01992 812145',
        'Lorem ipsum',
        'ChIJKzhNPhui2EcRtkv9zkPPv90',
        'https://www.thebulltheydonbois.co.uk/',
        '0101000020E61000003276C24B70EAB93F8AB8EF07F2D54940'
    ),
    (
        80,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Hyderabadi Bawarchi Indian restaurant',
        '9 Ron Leighton Way, London E6 1JA, UK',
        '020 8471 0352',
        'Curry house with a bar & a laid-back atmosphere, whipping up biryani & other Indian specialities.',
        'ChIJmdSU4BoOdkgRnBnNQiliRXU',
        'https://hyderabadibawarchionline.co.uk/order-now',
        '0101000020E6100000B7932D37BD30AA3FEB07D04AB5C44940'
    ),
    (
        81,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Boleyn Tavern',
        '1 Barking Rd, London E6 1PW, UK',
        '020 8472 2182',
        'Sizable traditional pub with stripped floors and a huge horseshoe-shaped bar - Britain''s longest.',
        'ChIJ3clx1s6n2EcR7B7oeDPrUFA',
        'http://www.boleyntavern.co.uk/',
        '0101000020E61000000F17258D7681A33F4AFA6AFDE3C34940'
    ),
    (
        82,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'Denmark Arms London',
        '381 Barking Rd, London E6 1LA, UK',
        '020 8552 4194',
        'Lorem ipsum',
        'ChIJL_CUizam2EcRVFxT6b2uzaM',
        'http://denmarkarms.com/',
        '0101000020E61000009F5BE84A04AAAB3FD4D1167C3FC44940'
    ),
    (
        83,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Red Lion E6',
        '80 High St S, London E6 6ET, UK',
        '020 8471 8887',
        'Cocktails, pizza & Sunday roasts served in a woodsy British pub with rustic touches & a beer garden.',
        'ChIJMd06KzGm2EcRgqdO7yAaAqA',
        'https://www.redlion-e6.co.uk/',
        '0101000020E6100000128942CBBA7FAC3F3D433866D9C34940'
    ),
    (
        84,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'A K I N A D E ‘ S Takeaway',
        '5 Barking Rd, London E13 9ND, UK',
        '07946 423325',
        'Lorem ipsum',
        'ChIJE-81mYin2EcRxGDDT4vxjqs',
        'https://www.alleatapp.com/menu-akinades-takeaway',
        '0101000020E6100000F1845E7F129FA33FE2E60AA5E5C34940'
    ),
    (
        85,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Telegraph',
        'Putney Heath, London SW15 3TU, UK',
        '020 8194 2808',
        'Spacious pub with renovated interior and extensive gastro menu, surrounded by leafy beer garden.',
        'ChIJh0jJlSEPdkgRnrxIT7kMf1E',
        'http://www.telegraphputney.co.uk/',
        '0101000020E6100000B900344A97FECCBF42C70E2A71B94940'
    ),
    (
        86,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Angel Roehampton SW15',
        '11 Roehampton High St, London SW15 4HL, UK',
        '020 3720 6312',
        'Relaxed pub featuring a garden patio, a pool table & darts, plus live music & TV sports.',
        'ChIJ0TpHE94OdkgRraHIW4ajTIQ',
        'https://theangelpub.com/',
        '0101000020E61000009AB91B9F24B8CEBFFC545FA7A2B94940'
    ),
    (
        87,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'King''s Head Roehampton',
        '1 Roehampton High St, London SW15 4HL, UK',
        '020 8789 1539',
        'Spacious gastropub with rustic-chic decor and Georgian period features, plus large terrace.',
        'ChIJ0TpHE94OdkgRHQRRNiPKZnI',
        'https://www.kingsheadsw15.co.uk/',
        '0101000020E6100000A23BD22A44D1CEBF7EC3E9C9A1B94940'
    ),
    (
        72,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Drinks Drop London - Online Cocktails',
        'Unit 3, 29a Chatham Pl, London E9 6NY, UK',
        '07745 527991',
        'Lorem ipsum',
        'ChIJMz2TrXgddkgRZGCAe0y62Eo',
        'https://thedrinksdrop.com/?utm_source=google&utm_medium=gbp+London&utm_campaign=Google+Business+Profile',
        '0101000020E61000000E6B2A8BC22EAABFD058FB3BDBC54940'
    ),
    (
        79,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        'The Millers Well - JD Wetherspoon',
        '419-421 Barking Rd, London E6 2JX, UK',
        '020 8471 8404',
        'Chain pub offering a classic range of food & drink in a laid-back space with local history displays.',
        'ChIJTw9hbd2n2EcRJnGQ3aYgGgU',
        'https://www.jdwetherspoon.com/pubs/all-pubs/england/london/the-millers-well-east-ham#*=\_',
        '0101000020E61000008553D5BAC3DCAC3FFD791A3048C44940'
    );

insert into
    public.pub_photos
values
    (
        1,
        '2023-02-22 21:39:41.834222+00',
        '57/biddle_1.png',
        57,
        't',
        NULL
    ),
    (
        2,
        '2023-02-22 21:41:09.381233+00',
        '43/pfranco_1.png',
        43,
        't',
        NULL
    ),
    (
        3,
        '2023-02-22 21:41:26.95005+00',
        '43/pfranco_2.png',
        43,
        't',
        NULL
    ),
    (
        4,
        '2023-02-22 21:41:44.374888+00',
        '43/pfranco_3.png',
        43,
        't',
        NULL
    ),
    (
        5,
        '2023-02-22 21:42:15.659308+00',
        '56/star_hd_1.png',
        56,
        't',
        NULL
    ),
    (
        6,
        '2023-02-22 21:42:29.648559+00',
        '56/star_hd_2.png',
        56,
        't',
        NULL
    ),
    (
        7,
        '2023-02-22 21:42:45.161107+00',
        '56/star_hd_3.png',
        56,
        't',
        NULL
    ),
    (
        8,
        '2023-02-22 21:42:59.58121+00',
        '56/star_hd_4.png',
        56,
        't',
        NULL
    ),
    (
        9,
        '2023-02-22 21:43:07.654261+00',
        '56/star_hd_5.png',
        56,
        't',
        NULL
    ),
    (
        10,
        '2023-02-22 21:43:22.316586+00',
        '56/star_hd_6.png',
        56,
        't',
        NULL
    ),
    (
        11,
        '2023-02-23 02:48:01.752622+00',
        '40/pembury_1.png',
        40,
        't',
        NULL
    ),
    (
        12,
        '2023-02-23 02:48:14.593997+00',
        '40/pembury_2.png',
        40,
        't',
        NULL
    ),
    (
        13,
        '2023-02-23 02:48:27.373884+00',
        '40/pembury_3.png',
        40,
        't',
        NULL
    ),
    (
        14,
        '2023-02-23 02:48:36.61439+00',
        '40/pembury_4.png',
        40,
        't',
        NULL
    );

insert into
    public.opening_hours
values
    (1, 56, 1, '1200', 1, '2300'),
    (2, 56, 2, '1200', 2, '2300'),
    (3, 56, 3, '1200', 3, '2300'),
    (4, 56, 4, '1200', 4, '2300'),
    (5, 56, 5, '1200', 6, '0100'),
    (6, 56, 6, '1200', 6, '2300');

-- USERS
insert into
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        raw_app_meta_data,
        raw_user_meta_data,
        email_confirmed_at,
        created_at
    )
values
    (
        '00000000-0000-0000-0000-000000000000',
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        'authenticated',
        'authenticated',
        'harrisonbourke97@gmail.com',
        '$2a$10$54Nv3gssrFzEo424i9ycdOwqcY0f8VFb1nqoxS2uVzapylTIIhdYy',
        '{"provider":"email","providers":["email"]}',
        '{}',
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now())
    );

insert into
    auth.identities (id, user_id, identity_data, provider, created_at)
values
    (
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        '{"sub": "185f2f83-d63a-4c9b-b4a0-7e4a885799e2"}',
        'harrisonbourke97@gmail.com',
        timezone('utc' :: text, now())
    );

insert into
    public.users_public
values
    (
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        timezone('utc' :: text, now()),
        'Harrison',
        '123'
    );

-- REVIEWS
insert into
    public.reviews (
        id,
        created_at,
        updated_at,
        pub_id,
        user_id,
        content,
        editors_review,
        rating
    )
values
    (
        1,
        timezone('utc' :: text, now()),
        timezone('utc' :: text, now()),
        56,
        '185f2f83-d63a-4c9b-b4a0-7e4a885799e2',
        'Lorem ipsom dolor sit amet',
        false,
        4
    )