interface Props {
	usernames: string[];
}

const ChatIcon: React.FC<Props> = ({ usernames }) => {
	const name1 = usernames[0];
	const name2 = usernames[1];
	let showTwoIcons = true;

	if (usernames.length == 1) {
		showTwoIcons = false;
	}

	const getAvatarUrl = (name: string) =>
		`https://ui-avatars.com/api/?name=${encodeURIComponent(
			name,
		)}&background=random&rounded=true&size=40`;

	return (
		<div className="relative w-12 h-12">
			<img
				src={getAvatarUrl(name1)}
				alt={name1}
				className={
					"absolute top-0 left-0 rounded-full outline-1 outline-blue-300 shadow-xs shadow-blue-300 " +
					(showTwoIcons ? "w-8 h-8" : "w-12 h-12")
				}
			/>
			{showTwoIcons && (
				<img
					src={getAvatarUrl(name2)}
					alt={name2}
					className="absolute bottom-0 right-0 w-8 h-8 rounded-full outline-1
							outline-blue-300
							shadow-xs
							shadow-blue-300
				"
				/>
			)}
		</div>
	);
};

export default ChatIcon;
