import type { IProps } from "./@types";

export const ModalGeneric = ({ isOpen, onClose, children }: IProps) => {
  return (
    <dialog open={isOpen} className="modal z-50">
      <div className="modal-box bg-white w-full max-w-11/12 md:max-w-md">
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle shadow-none btn-ghost absolute hover:bg-[#eaeaea80] !border-none !text-black right-2 top-2"
        >
          ✕
        </button>

        <div className="flex flex-col gap-2.5">{children}</div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};
