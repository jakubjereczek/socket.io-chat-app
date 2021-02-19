import React from 'react';

const Scroll = () => {

    useEffect(() => {
        // Scrollowanie od ostatniej wiadomosci.
        if (!userIsReadingMessagesAbove) {
            scroll.current && scroll.current.scrollIntoView({ behavior: "auto" }) // przejdzie do ostatniej wiadomosci
        }
    }, [MessagesListComponent]);

    const scrollManager = () => {
        if (scroll.current.getBoundingClientRect().y - container.current.getBoundingClientRect().height > 100) {
            // ok. 100 px nad ostatnią wiadomoscia - wtedy nie scrollować automatycznie wiadomosci
            setuserIsReadingMessagesAbove(true);
        } else {
            setuserIsReadingMessagesAbove(false);
        }
    }


    return (
        <ScrollHiddenElement ref={scroll}>last</ScrollHiddenElement>
    );
}

export default Scroll;