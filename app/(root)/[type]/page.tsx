import React from "react";
import Sort from "@/components/Sort";
import { getFiles, getTotalSpaceUsedForSection } from "@/lib/actions/file.actions";
import { Models } from "node-appwrite";
import Card from "@/components/Card";
import { getFileTypesParams } from "@/lib/utils";

const Page = async ({ searchParams, params }: SearchParamProps) => {
    const type = ((await params)?.type as string) || "";
    const searchText = ((await searchParams)?.query as string) || "";
    const sort = ((await searchParams)?.sort as string) || "";

    const types = getFileTypesParams(type) as FileType[];

    // Fetch files and total size for the specific section
    const [files, sectionSpace] = await Promise.all([
        getFiles({ types, searchText, sort }),
        getTotalSpaceUsedForSection(type), // Calculate size for the current type
    ]);
    // console.log(files, sectionSpace.used);
    const totalSizeMB = (sectionSpace?.used || 0) / (1024 * 1024); // Convert bytes to MB

    return (
        <div className="page-container">
            <section className="w-full">
                <h1 className="h1 capitalize">{type}</h1>

                <div className="total-size-section">
                    <p className="body-1">
                        Total: <span className="h5">{totalSizeMB.toFixed(2)} MB</span>
                    </p>

                    <div className="sort-container">
                        <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

                        <Sort />
                    </div>
                </div>
            </section>

            {/* Render the files */}
            {files.total > 0 ? (
                <section className="file-list">
                    {files.documents.map((file: Models.Document) => (
                        <Card key={file.$id} file={file} />
                    ))}
                </section>
            ) : (
                <p className="empty-list">No files uploaded</p>
            )}
        </div>
    );
};

export default Page;
