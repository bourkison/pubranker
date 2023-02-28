import { dayString, timeString } from '@/services';

describe('services', () => {
    describe('timeString', () => {
        it('formats 0 correctly', () => {
            expect(timeString('0')).toBe('12am');
        });

        it('formats 30 correctly', () => {
            expect(timeString('30')).toBe('12:30am');
        });

        it('formats 100 correctly', () => {
            expect(timeString('100')).toBe('1am');
        });

        it('formats 2000 correctly', () => {
            expect(timeString('2000')).toBe('8pm');
        });
    });

    describe('dayString', () => {
        it('formats days correctly', () => {
            expect(dayString(5)).toBe('Friday');
            expect(dayString(2)).toBe('Tuesday');
        });
    });
});
