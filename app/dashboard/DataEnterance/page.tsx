import FileUploadForm from "@/app/components/FileUploadForm";
import Header from "@/app/components/Header";
export default function page(){
    return(
        <div className="flex flex-col gap-8">
            <Header/>
            <FileUploadForm/>
        </div>
    )
}