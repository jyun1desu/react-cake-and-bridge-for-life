import React from 'react';
import { useRecoilValue } from 'recoil';
import { userDeckState } from 'store/deck';
import Card from '../Card'

const UserHandCards = ({ className }) => {
    const userDeck = useRecoilValue(userDeckState);
    const [nowPickSuit, setNowPickSuit] = React.useState(null);

    const handlePickCard = (e, suit) => {
        e.stopPropagation();
        if(suit === nowPickSuit){
            // 出牌
            setNowPickSuit(null);
        } else {
            setNowPickSuit(suit);
        }
    }

    return (
        <div
            className={className}>
            {userDeck.map(({number, suit}) => (<Card
                nowPickSuit={nowPickSuit}
                onClick={(e)=> handlePickCard(e,suit)}
                className="group user_card"
                key={number + suit}
                number={number}
                suit={suit}
                hasDetail
            />))}
        </div>
    )

}

export default UserHandCards