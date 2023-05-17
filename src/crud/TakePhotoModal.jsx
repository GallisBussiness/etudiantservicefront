import { Dialog } from "primereact/dialog";
import { create } from "react-modal-promise";
import Camera, { FACING_MODES, IMAGE_TYPES } from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import CropperImageModal from "./CropperImageModal";

function TakePhotoModal({ isOpen, onResolve, onReject }) {
  const onTake = (img) => {
    CropperImageModal({ img }).then(onResolve);
  };
  return (
    <>
      <Dialog
        header="Prendre Photo"
        visible={isOpen}
        style={{ width: "50vw" }}
        onHide={() => onReject()}
      >
        <div className="field">
          <Camera
            onTakePhotoAnimationDone={onTake}
            isFullscreen={false}
            idealFacingMode={FACING_MODES.ENVIRONMENT}
            idealResolution={{ width: 160, height: 90 }}
            isMaxResolution={true}
            imageType={IMAGE_TYPES.JPG}
            imageCompression={0.97}
            sizeFactor={1}
          />
        </div>
      </Dialog>
    </>
  );
}

export default create(TakePhotoModal);
