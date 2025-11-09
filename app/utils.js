// export function generateColor(str) {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//         hash = str.charCodeAt(i) + ((hash << 5) - hash);
//     }
//     let color = '#';
//     for (let i = 0; i < 3; i++) {
//         let value = (hash >> (i * 8)) & 0xff;
//         color += value.toString(16).padStart(2, '0');
//     }
//     return color;
// }


export function generateColor(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
}
