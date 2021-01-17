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