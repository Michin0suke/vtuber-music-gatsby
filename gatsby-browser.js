import "./src/styles/global.css"
import React, { useState, useEffect } from 'react';
import Layout from './src/components/layout'

export const wrapPageElement = ({ element, props }) => {
    return (
        <Layout
            {...props}
        >
            {element}
        </Layout>
    )
}

const ReactDOM = require('react-dom')

export function replaceHydrateFunction() {
    return (element, container, callback) => {
        ReactDOM.render(element, container, callback)
    }
}