import { useQueryClient,useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

const UseFollow= ()=>{
    const queryClient = useQueryClient();

   ;

    const {mutate:follow_unfollow , isPending} = useMutation({
        mutationFn:async(userId)=>{
            try {
                console.log(JSON.stringify(userId))
                const res = await fetch("http://localhost:5000/api/users/follow/"+`${userId}`,{
                    method :"POST",
                    withCredentials:true,
                    credentials:"include"
                })
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "something went wrong");
                }

                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
        onSuccess:()=>{
            Promise.all([
                queryClient.invalidateQueries({queryKey:["authUser"]}),
                queryClient.invalidateQueries({queryKey:["suggestedUser"]}),
            ])
        },
        onError:(error)=>{
            toast.error(error.message)
        }
    })

    return {follow_unfollow , isPending};
};

export default UseFollow;