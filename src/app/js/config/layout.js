// react dependencies
import React from 'react';

// app dependencies
import GlobalHeader from '../components/global/header';
import GlobalFooter from '../components/global/footer';

class Layout extends React.Component {
    render() {
        return (
            <div>
                <GlobalHeader />
                {
                    // page content
                    React.cloneElement(this.props.children, this.props)
                }
                <GlobalFooter />
            </div>
        )
    }
}

export default Layout;