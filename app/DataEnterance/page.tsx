import React from "react";
import Header from "../components/Header";
import FileUploadForm from "../components/FileUploadForm";
export default function page(){
    return(
        <div className="flex flex-col gap-8">
            <Header/>
            <FileUploadForm/>
        </div>
    )
}