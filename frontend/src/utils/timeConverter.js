export default (time) => {
    const date = new Date(time);
    let hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
    let minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
    let seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
    return `${hours}:${minutes}:${seconds}`;
};
