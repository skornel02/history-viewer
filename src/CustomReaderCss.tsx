import React from 'react';

const css = `
#contentBody {
    padding: 10px;
    margin: 0 auto;
}
`;

const CustomReaderCss: React.FunctionComponent = () => {
    return (
        <div id="ReaderCss">
            <style>
                {css}
            </style>
        </div>
    );
};

export default CustomReaderCss;