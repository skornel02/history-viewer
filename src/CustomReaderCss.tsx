import React from 'react';

const css = `
#contentBody {
    padding: 10px;
    margin: 0 auto;
}
#contentBody>div {
    padding: 10px;
    margin: 0 !important;
}
`;

const lefter: string[] = [];
for (let i = 0; i <= 20; i++) {  
    lefter.push(
`.c${i} {
    margin-left: ${i * 2}vw !important;
}`
);
}

const CustomReaderCss: React.FunctionComponent = () => {
    return (
        <div id="ReaderCss">
            <style>
                {css}
            </style>
            <style>
                {lefter}
            </style>
        </div>
    );
};

export default CustomReaderCss;