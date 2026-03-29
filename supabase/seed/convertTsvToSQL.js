let inputText = '';
const pubs = inputText.split('\n');

const convert = () => {
    let pubsString = `
        INSERT INTO 
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
                location,
                reservable,
                dog_friendly,
                live_sport,
                beer_garden,
                kid_friendly,
                free_wifi,
                rooftop,
                wheelchair_accessible,
                hidden,
                brewery,
                dart_board,
                foosball_table,
                pool_table
            ) 
        values
            `;

    let allOpeningHoursStrings = `
        INSERT INTO
            public.opening_hours (
                pub_id,
                open_day,
                open_hour,
                close_day,
                close_hour
            )
        VALUES    
            `;

    for (let i = 0; i < pubs.length; i++) {
        if (i === 0) {
            continue;
        }

        const pub = pubs[i].split('\t');

        let pubString = `(
            ${i}, 
            timezone('utc' :: text, now()), 
            timezone('utc' :: text, now()), 
            '${pub[0].replaceAll("'", "''")}', 
            '${pub[1].replaceAll("'", "''")}',
            '${pub[2].replaceAll("'", "''")}',
            'Lorem ipsum',
            '${pub[3].replaceAll("'", "''")}',
            '${pub[5].replaceAll("'", "''")}',
            ST_SetSRID(ST_MakePoint(${pub[14].split(',')[1].trim()}, ${pub[14]
            .split(',')[0]
            .trim()}), 4326),
            ${pub[4] || 'NULL'},
            ${pub[6] || 'NULL'},
            ${pub[7] || 'NULL'},
            ${pub[8] || 'NULL'},
            ${pub[9] || 'NULL'},
            ${pub[10] || 'NULL'},
            ${pub[11] || 'NULL'},
            ${pub[12] || 'NULL'},
            ${pub[13] || 'NULL'},
            ${pub[15] || 'NULL'},
            ${pub[16] || 'NULL'},
            ${pub[17] || 'NULL'},
            ${pub[18] || 'NULL'}
        )`;

        const convertOpeningHours = () => {
            let ohString = '';

            // Monday
            if (pub[20] && pub[21]) {
                let openDay = 1;
                let closeDay = 1;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[21]) < parseInt(pub[20])) {
                    closeDay = 2;
                }

                ohString += `(${i}, ${openDay}, '${pub[20]}', ${closeDay}, '${pub[21]}'),\n`;
            }

            // Tuesday
            if (pub[22] && pub[23]) {
                let openDay = 2;
                let closeDay = 2;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[22]) < parseInt(pub[23])) {
                    closeDay = 3;
                }

                ohString += `(${i}, ${openDay}, '${pub[22]}', ${closeDay}, '${pub[23]}'),\n`;
            }

            // Wednesday
            if (pub[24] && pub[25]) {
                let openDay = 3;
                let closeDay = 3;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[24]) < parseInt(pub[25])) {
                    closeDay = 4;
                }

                ohString += `(${i}, ${openDay}, '${pub[24]}', ${closeDay}, '${pub[25]}'),\n`;
            }

            // Thursday
            if (pub[26] && pub[27]) {
                let openDay = 4;
                let closeDay = 4;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[26]) < parseInt(pub[27])) {
                    closeDay = 5;
                }

                ohString += `(${i}, ${openDay}, '${pub[26]}', ${closeDay}, '${pub[27]}'),\n`;
            }

            // Friday
            if (pub[28] && pub[29]) {
                let openDay = 5;
                let closeDay = 5;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[28]) < parseInt(pub[29])) {
                    closeDay = 6;
                }

                ohString += `(${i}, ${openDay}, '${pub[28]}', ${closeDay}, '${pub[29]}'),\n`;
            }

            // Saturday
            if (pub[30] && pub[31]) {
                let openDay = 6;
                let closeDay = 6;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[30]) < parseInt(pub[31])) {
                    closeDay = 7;
                }

                ohString += `(${i}, ${openDay}, '${pub[30]}', ${closeDay}, '${pub[31]}'),\n`;
            }

            // Sunday
            if (pub[32] && pub[33]) {
                let openDay = 7;
                let closeDay = 7;

                // If the number of opening is less than the number of closing, then we are on the same day still
                // If closing hour is less than number of opening hour, then we are on the next day
                if (parseInt(pub[32]) < parseInt(pub[33])) {
                    closeDay = 1;
                }

                ohString += `(${i}, ${openDay}, '${pub[32]}', ${closeDay}, '${pub[33]}'),\n`;
            }

            return ohString + '\n';
        };

        let openingHoursString = convertOpeningHours();

        if (i !== pubs.length - 1) {
            pubString += ',\n';
        }

        pubsString += pubString;
        allOpeningHoursStrings += openingHoursString;
    }

    console.log(pubsString);
    console.log(allOpeningHoursStrings);

    return { pubs: pubsString, oh: allOpeningHoursStrings };
};

convert();
