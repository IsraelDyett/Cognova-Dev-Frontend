import { cn } from "@/lib/utils";
import { FiMonitor, FiSmartphone, FiTablet } from "react-icons/fi";
import {
	SiGooglechrome,
	SiFirefox,
	SiSafari,
	SiOpera,
	SiMicrosoftedge,
	SiApple,
	SiInstagram,
} from "react-icons/si";
import { FaWindows, FaApple, FaLinux, FaAndroid } from "react-icons/fa";

export const Icons = {
	IconSpinner: ({ className, ...props }: React.ComponentProps<"svg">) => {
		return (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={cn("size-4 animate-spin text-white", className)}
				{...props}
			>
				<circle
					strokeWidth={4}
					stroke="currentColor"
					r="10"
					cy="12"
					cx="12"
					className="opacity-25"
				/>
				<path d="M4 12a8 8 0 018-8v8H4z" fill="currentColor" className="opacity-75" />
			</svg>
		);
	},
};
export const showBrowserIcon = (browser?: string | null) => {
	let icon;
	if (browser?.toLowerCase().includes("chrome")) {
		icon = <SiGooglechrome className="inline mr-2" />;
	} else if (browser?.toLowerCase().includes("firefox")) {
		icon = <SiFirefox className="inline mr-2" />;
	} else if (browser?.toLowerCase().includes("safari")) {
		icon = <SiSafari className="inline mr-2" />;
	} else if (browser?.toLowerCase().includes("opera")) {
		icon = <SiOpera className="inline mr-2" />;
	} else if (browser?.toLowerCase().includes("instagram")) {
		icon = <SiInstagram className="inline mr-2" />;
	} else if (browser?.toLowerCase().includes("edge")) {
		icon = <SiMicrosoftedge className="inline mr-2" />;
	}
	return (
		<div>
			{icon}
			{browser}
		</div>
	);
};
export const showOsIcon = (os?: string | null) => {
	let icon;
	if (os?.toLowerCase().includes("windows")) {
		icon = <FaWindows className="inline mr-2" />;
	} else if (os?.toLowerCase().includes("mac")) {
		icon = <FaApple className="inline mr-2" />;
	} else if (os?.toLowerCase().includes("linux")) {
		icon = <FaLinux className="inline mr-2" />;
	} else if (os?.toLowerCase().includes("ios")) {
		icon = <SiApple className="inline mr-2" />;
	} else if (os?.toLowerCase().includes("android")) {
		icon = <FaAndroid className="inline mr-2" />;
	}
	return (
		<div>
			{icon}
			{os}
		</div>
	);
};
export const showDeviceIcon = (device?: string | null) => {
	let icon;
	if (device?.toLowerCase().includes("mobile")) {
		icon = <FiSmartphone className="inline mr-2" />;
	} else if (device?.toLowerCase().includes("tablet")) {
		icon = <FiTablet className="inline mr-2" />;
	} else {
		icon = <FiMonitor className="inline mr-2" />;
	}
	return (
		<div>
			{icon}
			{device}
		</div>
	);
};
