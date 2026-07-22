import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import AudioPlayer from "./components/AudioPlayer";
import { PlaybackControls } from "./components/PlaybackControls";
import { Suspense, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PageTransitionFallback = () => (
	<div className="h-full bg-zinc-950 p-6" aria-label="Loading page">
		<div className="h-8 w-40 rounded bg-zinc-800/70 animate-pulse mb-6" />
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{Array.from({ length: 8 }).map((_, index) => (
				<div key={index} className="aspect-square rounded-md bg-zinc-900 animate-pulse" />
			))}
		</div>
	</div>
);

const PageOutlet = () => (
	<Suspense fallback={<PageTransitionFallback />}>
		<Outlet />
	</Suspense>
);

const MainLayout = () => {
	const [isMobile, setIsMobile] = useState(false);
	const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
	const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	// Mobile layout
	if (isMobile) {
		return (
			<div className="h-screen bg-black text-white flex flex-col">
				<AudioPlayer />
				<div className="flex-1 flex flex-col overflow-hidden">
					<PageOutlet />
				</div>
				<PlaybackControls />
			</div>
		);
	}

	// Desktop layout with resizable panels
	return (
		<div className="h-screen bg-black text-white flex flex-col relative">
			<AudioPlayer />
			<ResizablePanelGroup direction="horizontal" className="flex-1 w-full">
				{/* Left Sidebar */}
				<ResizablePanel
					defaultSize={20}
					minSize={15}
					maxSize={25}
					collapsible
					collapsedSize={0}
					collapsed={isLeftSidebarCollapsed}
					onCollapse={() => setIsLeftSidebarCollapsed(true)}
					onExpand={() => setIsLeftSidebarCollapsed(false)}
					className="transition-all duration-300 ease-in-out"
				>
					<LeftSidebar />
				</ResizablePanel>
				<ResizableHandle className="group w-2 relative">
					<div className="w-full h-full bg-transparent group-hover:bg-green-500/50 transition-colors duration-300 data-[resize-handle-state=drag]:bg-green-500" />
					<button
						onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
						className="absolute top-1/2 left-1/2 z-50 p-1 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all duration-300 shadow-lg border border-zinc-600 -translate-x-1/2 -translate-y-1/2"
						title={isLeftSidebarCollapsed ? "Show Library" : "Hide Library"}
					>
						{isLeftSidebarCollapsed ? (
							<ChevronRight className="w-4 h-4" />
						) : (
							<ChevronLeft className="w-4 h-4" />
						)}
					</button>
				</ResizableHandle>

				{/* Main Content */}
				<ResizablePanel defaultSize={60} minSize={30}>
					<PageOutlet />
				</ResizablePanel>
				<ResizableHandle className="group w-2 relative">
					<div className="w-full h-full bg-transparent group-hover:bg-green-500/50 transition-colors duration-300 data-[resize-handle-state=drag]:bg-green-500" />
					<button
						onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
						className="absolute top-1/2 left-1/2 z-50 p-1 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all duration-300 shadow-lg border border-zinc-600 -translate-x-1/2 -translate-y-1/2"
						title={
							isRightSidebarCollapsed
								? "Show Friends Activity"
								: "Hide Friends Activity"
						}
					>
						{isRightSidebarCollapsed ? (
							<ChevronLeft className="w-4 h-4" />
						) : (
							<ChevronRight className="w-4 h-4" />
						)}
					</button>
				</ResizableHandle>
				{/* Right Sidebar */}
				<ResizablePanel
					defaultSize={20}
					minSize={15}
					maxSize={25}
					collapsible
					collapsedSize={0}
					collapsed={isRightSidebarCollapsed}
					onCollapse={() => setIsRightSidebarCollapsed(true)}
					onExpand={() => setIsRightSidebarCollapsed(false)}
					className="transition-all duration-300 ease-in-out"
				>
					<FriendsActivity />
				</ResizablePanel>
			</ResizablePanelGroup>
			<PlaybackControls />
		</div>
	);
};

export default MainLayout;
