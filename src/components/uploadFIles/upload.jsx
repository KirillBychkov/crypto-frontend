import React, {useCallback, useContext, useState} from "react";
import Uploady, {
    useBatchAddListener,
    useItemFinalizeListener,
    useItemStartListener,
    useUploady
} from "@rpldy/uploady";
import { useAxios } from "@/auth/axios-hook";
import { ToastContext } from "@/App";
import { getUploadPreviewForBatchItemsMethod } from "@rpldy/upload-preview";
import { useAuth } from "@/auth/auth-hook";
import { queryClient } from "@/queryClient";
import UploadButton from "@rpldy/upload-button";
import './image.sass';

const BatchAddUploadPreview =
    getUploadPreviewForBatchItemsMethod(useBatchAddListener);

const CropPreviewFieldComp = ({ name, url }) => {
    return (
        <div className={'imagePreview'}>
            <span>{name}</span>
            <img className="preview-thumb" src={url} alt={"Uploaded image"} />
        </div>
    );
};

const UploadCropField = ({ allowSelect }) => {
    return (
        <div>
            {allowSelect && (
                <UploadButton extraProps={{
                    type: "button",
                    className: "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                }}>
                    Choose image
                </UploadButton>
            )}

            <BatchAddUploadPreview
                PreviewComponent={CropPreviewFieldComp}
            />
        </div>
    );
};

const MyForm = () => {
    const [uploadState, setUploadState] = useState(0);
    const { processPending } = useUploady();

    useBatchAddListener(() => {
        setUploadState(1);
    });

    useItemStartListener((batch) => {
        setUploadState(2);
    });

    useItemFinalizeListener(() => {
        setUploadState(3);
    });

    return (
        <div className={'formStyledUpload'}>
            <UploadCropField allowSelect={!uploadState}/>
            {!uploadState && <br/>}
            <textarea
                className={'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'}
                id="description-for-trade"
                cols="50"
                rows="5"
                style={{resize: "none"}}
                defaultValue={"Please type the reasons of the enter and add some screens"}>
            </textarea>
            <br/>
            {uploadState === 1 && <button
                type="button"
                onClick={() => processPending()}
                className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
                Submit
            </button>
            }
            {uploadState === 2 && <div>Uploading...</div>}
            {uploadState === 3 && <div>Finished</div>}
        </div>
    );
};

export default function ReactUploadCropper({ groupId, close }) {
    const { token } = useAuth();
    const { dairyService } = useAxios();
    const toast = useContext(ToastContext);
    let i = 0;

    const filterBySize = useCallback((file) => {
        if(i > 3) return false;
        i++;
        return file.size < 1024 * 1024;
    }, []);

    return (
        <Uploady
            fileFilter={filterBySize}
            clearPendingOnAdd
            grouped={true}
            multiple={true}
            sendWithFormData={true}
            accept={"image/*"}
            autoUpload={false}
            isSuccessfulCall={() => {
                dairyService?.put('upload/' + groupId, {
                    description: document.getElementById("description-for-trade")?.value
                }).then((res) => {
                    if(res.status === 200) {
                        queryClient.invalidateQueries({ queryKey: ['tradegroups'] });
                        toast.setToast({
                            open: true,
                            status: false,
                            text: 'Upload successful!'
                        })
                    } else {
                        toast.setToast({
                            open: true,
                            status: true,
                            text: 'Upload failed!'
                        })
                    }
                }).catch((e) => {
                    toast.setToast({
                        open: true,
                        status: true,
                        text: e.message || 'Upload failed!'
                    })
                }).finally(() => close());
            }}
            onError={(e) => {
                close();
                toast.setToast({
                    open: true,
                    status: true,
                    text: 'Upload failed!'
                })
            }}
            destination={{
                url: import.meta.env.VITE_SERVER_URL + "/upload/" + groupId,
                headers: {
                    authorization: 'Bearer ' + token
                }
        }}>
            <div className="uploaderDiv">
                <MyForm groupId={groupId} />
            </div>
        </Uploady>
    );
}
