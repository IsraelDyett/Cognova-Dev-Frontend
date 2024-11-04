import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface WorkspacePageProps {
  params:       Params;
  searchParams: SearchParams;
}

export interface Params {
  workspace_slug: string;
  bot_uuid:       string;
}

export interface SearchParams {
}