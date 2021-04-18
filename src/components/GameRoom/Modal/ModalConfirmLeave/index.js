import React from 'react';
import { useRecoilState } from 'recoil';
import { themeState } from 'store/theme';
import { color } from 'style/theme';
import styled from 'styled-components';
import Modal from 'components/Global/Modal';
import Kanahei from 'assets/bumpintowindow.gif';

const themeData = {
    light: { 
        bg: 'white',
        border: 'none',
        fg: color.$default_font_color,
        yes_button_fg: 'white',
        yes_button_bg: color.$pink_color,
        no_button_fg: 'white',
        no_button_bg: color.$green_color,
    },
    dark: { 
        bg: color.$dark_dim_bg_color,
        border: `1px solid ${color.$dark_dim_border_color}`,
        fg: color.$dark_default_font_color,
        yes_button_fg: color.$fluorescent_pink_color,
        yes_button_bg: 'transparent',
        no_button_fg: color.$fluorescent_green_color,
        no_button_bg: 'transparent',
    },
}

const AskBox = styled.div`
    display:  flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 5px;
    overflow: hidden;
    transition: .5s all;
    background-color: ${({theme}) => themeData[theme].bg };
    border: ${({theme}) => themeData[theme].border };

    .title {
        padding: 10px 0;
        text-align: center;
        letter-spacing: 1px;
        color: white;
        background-color: ${color.$pink_color};
    }

    .content {
        display:  flex;
        flex-direction: column;
        align-items: center;
        padding: 25px 15px 15px;

        img {
        width: 80px;
        margin-bottom: 20px;
        }

        p {
            transition: .5s all;
            color: ${({theme}) => themeData[theme].fg };
        }
    }

    .button_area {
        display: flex;
        & > button {
            padding: 8px 0;
            font-size: 15px;
            letter-spacing: 2px;
            flex: 1 1 50%;
            transition: .5s all;

            &:first-child {
                background-color: ${({theme}) => themeData[theme].yes_button_bg };
                color: ${({theme}) => themeData[theme].yes_button_fg };
                border-top: ${({theme}) => themeData[theme].border };
                border-right: ${({theme}) => themeData[theme].border };
            }

            &:last-child {
                background-color: ${({theme}) => themeData[theme].no_button_bg };
                color: ${({theme}) => themeData[theme].no_button_fg };
                border-top: ${({theme}) => themeData[theme].border };
            }
        }
    }
`

const Content = () => {
    const [theme] = useRecoilState(themeState);
    return (
        <AskBox theme={theme}>
            <div className="content">
                <img alt="celebrate-icon" className="icon" src={Kanahei}></img>
                <p>確定要離開嗎？</p>
            </div >
            <div className="button_area">
                <button>離開</button>
                <button>繼續玩</button>
            </div>
        </AskBox >
    )
}

const ModalConfirmLeave = () => {
    return (
        <Modal
            className="confirm_leave_modal">
            <Content />
        </Modal >
    );
}

export default ModalConfirmLeave