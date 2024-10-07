import React, { useEffect, useState } from "react";

const ImageLoader = ({ onClick, src, style, className, alt, onLoad, loaderImageWidth }) => {
    const [loading, setLoading] = useState(true);
    const onImgLoad = ({ target: img }) => {
        setLoading(false);
        if (onLoad != null) {
            onLoad({ target: img });
        }
    };

    if (loaderImageWidth == null) {
        loaderImageWidth = "120px"
    }

    return (
        <>
            <span style={{ display: loading ? "inline" : "none" }}>
                <img
                    src="../images/loader.gif"
                    style={{
                        minWidth: "25px",
                        width: (loaderImageWidth),
                        // maxWidth: "120px",
                        // border: "1px solid #dcdcdc",
                        objectFit: "contain",
                        margin: "0 3px 0",
                    }}
                />
            </span>
            <span className="upload-dynamic" style={{ display: loading ? "none" : "inline" }}>
                <img
                    src={src}
                    style={style}
                    className={className}
                    alt={alt}
                    onClick={onClick}
                    onLoad={onImgLoad}
                />
            </span>
        </>
    );
};
export default ImageLoader;
