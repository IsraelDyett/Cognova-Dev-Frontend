import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export interface WorkspacePageProps {
	params: Params;
	searchParams: any;
}

export interface Params {
	workspaceId: string;
	botId: string;
	businessId: string;
}
