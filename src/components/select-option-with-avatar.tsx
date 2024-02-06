import React from "react";
import { CustomAvatar } from "./custom-avatar";

type SelectOptionWithAvatarProps = {
	name: string,
	avatarUrl?: string,
	shape?: 'circle' | 'square'
};

export const SelectOptionWithAvatar = ({name, avatarUrl, shape}: SelectOptionWithAvatarProps) => {
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				gap: '8px'
			}}
		>
			<CustomAvatar
				shape={shape}
				name={name} 
				src={avatarUrl}
			/>
		</div>
	)
};
