import ProfileEditor from "@/components/EditData/ProfileEditor";


export default function EditPage({params:{username}}: {params: {username: string}}) {
    return (
        <ProfileEditor username={username}/>

    )
}