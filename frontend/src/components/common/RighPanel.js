import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./LoadingSpinner";
import UseFollow from "../../hooks/UseFollow";

const RightPanel = () => {
	const { data: suggestedUser, isLoading } = useQuery({
		queryKey: ["suggestedUser"],
		queryFn: async () => {
		  try {
			const res = await fetch("http://localhost:5000/api/users/suggested",{
				withCredentials:true,
				credentials:"include",
			});
			const data = await res.json();
			if(data.error) return null;
			if (!res.ok) {
			  throw new Error(data.error || "Something went wrong");
			}
			return data;
		  } catch (error) {
			throw new Error(error.message);
		  }
		}
	});

	if(suggestedUser?.length ===0) return <div className='md:w-64 w-0'></div>

	const{follow_unfollow , isPending}= UseFollow();
	


	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{/* item */}
					{isLoading && (
						<>
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
							<RightPanelSkeleton />
						</>
					)}
					{!isLoading &&
						suggestedUser?.map((user) => (
							<Link
								to={`/profile/${user.username}`}
								className='flex items-center justify-between gap-4'
								key={user._id}
							>
								<div className='flex gap-2 items-center'>
									<div className='avatar'>
										<div className='w-8 rounded-full'>
											<img src={user.profileImg || "/avatar-placeholder.png"} />
										</div>
									</div>
									<div className='flex flex-col'>
										<span className='font-semibold tracking-tight truncate w-28'>
											{user.fullName}
										</span>
										<span className='text-sm text-slate-500'>@{user.username}</span>
									</div>
								</div>
								<div>
									<button
										className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
										onClick={(e) => {
											e.preventDefault()
											follow_unfollow(user._id)
										}}
										>
										{isPending ?<LoadingSpinner size='sm'/>:"follow"}
									</button>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;