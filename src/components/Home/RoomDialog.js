import React from 'react';
import db from "database";
import { v4 as uuidv4 } from 'uuid';

import styled from 'styled-components';
import { color } from 'style/theme'

import Dialog from "components/Global/Modal";
import Button from 'components/Global/Button';
import Input from 'components/Global/Input';

import { userNameState, userRoomState,userIDState } from "store/user";
import { useSetRecoilState,useRecoilValue } from "recoil";
import { useHistory } from "react-router-dom";

const Content = styled.div`
	background-color: #fff;
	width: 80vw;
	position: absolute;
	border-radius: 10px;
	overflow: hidden;
	position: relative;

	.cancel_button {
	font-size: 14px;
	position: absolute;
	cursor: pointer;
	color: #fff;
	background-color: ${color.$warn_red_color};
	border-radius: 50%;
	padding: 3px;
	right: 5px;
	top: 5px;
	}

	& > .title {
	padding: 15px;
	background-color: ${color.$pink_color};
	text-align: center;
	color: #fff;
	font-size: 20px;
	letter-spacing: 2px;
	}

	.block {
		padding: 15px 15px 5px;

		.title {
			color: #888;
			margin: 0;
			text-align: center;
			padding-bottom: 5px;
			border-bottom: 1.5px solid ${color.$under_line_color};
			font-size: 14px;
			letter-spacing: 1px;
		}

		&.join_exist_room {
			.room_list {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-top: 10px;
			max-height: 150px;
			overflow: scroll;
			}

			.no_room {
			color: ${color.$unable_color};
			text-align: center;
			font-size: 14px;
			letter-spacing: 1px;
			}

			.room {
			margin-bottom: 10px;
			font-size: 16px;
			letter-spacing: 1px;
			}
		}

		&.create_room {
			.content {
			padding: 10px;
			box-sizing: border-box;

				form {
					display: flex;
					justify-content: space-between;

					.room_name {
						margin-right: 20px;
						text-align: left;
						border-bottom: 2px solid ${color.$unable_color};
						font-size: 18px;
						letter-spacing: 2px;

						&::placeholder {
							font-size: 12px;
							color: ${color.$unable_color};
							text-align: center;
							margin: 10px 0 0;
							letter-spacing: 2px;
						}
					}
				}

				.warn_message {
					margin: 10px 0 0;
					font-size: 12px;
					letter-spacing: 1px;
					color: ${color.$warn_red_color};
				}
			}
		}
	}
`

const RoomDialog = ({ className, closeRoomList, style, roomList }) => {
	const history = useHistory();
	const userName = useRecoilValue(userNameState);
	const setLocalRoom = useSetRecoilState(userRoomState);
	const setUserID = useSetRecoilState(userIDState);
	const [userInputRoom, setUserInputRoom] = React.useState('');
	const [warnMessage,setWarnMessage] = React.useState('');

	const createRoom = (e) => {
		e.preventDefault();
		if (userInputRoom.length < 3) return setWarnMessage('請輸入至少三個字');
		if (roomList.includes(userInputRoom)) return setWarnMessage('已有重複房名');
		setLocalRoom(userInputRoom);
		updateDbRoomData(userInputRoom);
	}

	const pickExistRoom = (roomName) => {
		setLocalRoom(roomName);
		updateDbRoomData(roomName);
	}

	const updateDbRoomData = async(roomName) => {
		const roomRef = db.database().ref(`/${roomName}`);
		const userID = uuidv4();
		const timestamp = Date.parse(new Date());
		setUserID(userID);
		await roomRef.child('playersInfo').child(userID).update({timestamp,userID,player:userName});
		const toPath = `/${roomName}/waiting_room/${userID}`
		history.push(toPath);
	}

	return (
		<Dialog 
			style={style}
			onDeactive={(e) => {
				closeRoomList(e);
			}} 
			className={className}>
			<Content
				onClick={ e => e.stopPropagation()}
				className="content">
				<button
					onClick={(e) => closeRoomList(e)}
					className="cancel_button">×</button>
				<div className="title">選擇或創建房間</div>
				<div className="room_choose">
					<div className="block join_exist_room">
						<p className="title">選擇已經存在的房間</p>
						{!roomList.length
							? <p className="no_room">目前尚無空房</p>
							: <div className="room_list">
								{roomList.map(room => {
									return <Button
										onClick={() => pickExistRoom(room)}
										key={room}
										color={`${color.$green_color}`}
										className="room">{room}</Button>
								})}
							</div>
						}
					</div>
					<div className="block create_room">
						<p className="title">建立一個房間</p>
						<div className="content">
							<form>
								<Input
									value={userInputRoom}
									onChange={(e) => {
										setWarnMessage('');
										setUserInputRoom(e.target.value)
									}}
									type="text"
									maxLength="8"
									placeholder="請輸入3-8字元"
									className="room_name"
								/>
								<Button
									color={userInputRoom.length > 2 ? `${color.$highlight_color}` : `${color.$unable_color}`}
									onClick={e=>createRoom(e)}
									className='create_button'
								>建立</Button>
							</form>
							{warnMessage && <p className='warn_message'>{warnMessage}</p>}
						</div>
					</div>
				</div >
			</Content >
		</Dialog >
	);
}

export default RoomDialog;