import { cls } from "@libs/client/utils";
import Image from "next/image";
import { Suspense } from "react";

interface ImgComponentProps {
  isLayout?: boolean;
  layoutHeight?: string;
  width?: number;
  height?: number;
  imgAdd: string;
  clsProps?: string;
  imgName?: string;
}

export default function ImgComponent({
  isLayout,
  width,
  height,
  imgAdd,
  clsProps,
  layoutHeight,
  imgName,
}: ImgComponentProps) {
  return (
    <div className={cls(isLayout ? `relative ${layoutHeight}` : "")}>
      {isLayout ? (
        <Image src={imgAdd} layout="fill" className={clsProps} alt={imgName} />
      ) : (
        <Image
          src={imgAdd}
          width={width}
          height={height}
          className={clsProps}
          alt={imgName}
        />
      )}
    </div>
  );
}
