import { Avatar as AntAvatar } from "antd";
import { AvatarProps } from "antd/lib";
import { getNameInitials } from "@/utils/get-name-initials";

type CustomAvatarProps = AvatarProps & {
	name?: string,
}

export const CustomAvatar = ({name, style, ...rest}:CustomAvatarProps) => {
	return (
		<AntAvatar
			alt={name}
			size='small'
			style={{
				backgroundColor: '#87d068', 
				display: 'flex', 
				alignItems: 'center', 
				border: 'none',
				...style
			}}
			{...rest}
		>
			{getNameInitials(name || '', 2)}
		</AntAvatar>
	)
};
