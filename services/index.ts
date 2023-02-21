export const convertPointStringToObject = (
    input: string,
): { lat: number; lng: number } => {
    const firstIndex = input.indexOf('(');
    const secondIndex = input.indexOf(')');

    if (firstIndex < 0 || secondIndex < 0) {
        throw new Error('No brackets found.');
    }

    const arr = input
        .substring(firstIndex + 1, secondIndex)
        .split(' ')
        .map(i => parseFloat(i));

    return {
        lat: arr[0],
        lng: arr[1],
    };
};
