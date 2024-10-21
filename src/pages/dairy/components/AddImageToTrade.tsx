import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { ITradeGroup } from "@/shared/common.ts";
import ReactUploadCropper from "@/components/uploadFIles/upload.jsx";

export function AddImageToTrade({ group }: { group: ITradeGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
      <DialogTrigger asChild>
        <Button>
          {!group.description && !group.images.length?
              <span>Upload info</span> :
              <span>Info</span>}
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {!group.description && !group.images.length?
                <span>Add images and description</span> :
                <span>Images and description</span>}
          </DialogTitle>
          <DialogDescription>
            {!group.description && !group.images.length?
                <span>Specify some detail of the position which can be helpful in the future. Only 4 images maximum.</span> :
                <span>This is a detail of the position which can be helpful for you.</span>}
          </DialogDescription>
        </DialogHeader>

        {!group.description && !group.images.length?
            <ReactUploadCropper groupId={group?.id} close={() => setOpen(false)}/> :
            <div className={'flex flex-wrap'}>
              {group.images.map((image, i) => (
                  <div className={"imagePreview"} key={"image" + i}>
                    <img className="preview-thumb" onClick={() => {
                       const H = 1000, W = 1000, Caption = "Image Preview", imgSrc = image;
                       const newImg = window.open("","myImg","height="+H+",width="+W+"")
                       newImg.document.write("<title>"+ Caption +"</title>")

                       newImg.document.write("<img src='" + imgSrc + "' width='" + W + "'  height='" + H + "' onclick='window.close()' style='width: " + W + "  height: " + H + " ;position:absolute;left:0;top:0;object-fit: contain;'>")
                       newImg.document.write("<script type='text/javascript'> document.oncontextmenu = new Function('return false') </script>")

                       newImg.document.close()
                     }}
                     src={image} alt={"image" + i} />
                  </div>
              ))}
              <p style={{ whiteSpace: "pre-line" }}>{group.description}</p>
            </div>}
      </DialogContent>
    </Dialog>
  );
}
