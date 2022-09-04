import React from "react";

interface Props
    {
        message: string|null;
        messageType: string|null;
        dismissMessageBox(): void;
    }

interface State
    {

    }

const defaultState: State = 
    {

    }

export default class MessageBox extends React.Component<Props, State> {
    constructor( props: Props ) {
        super( props );

        this.state = defaultState;
    }

    private getMessage(): string
        {
            return ( this.props.message !== null ) ? String( this.props.message ) : 'No Errors';
        }

    render() {
        return (
            <>
                <figure className={`${this.props.message ? this.props.messageType : ''}`}>
                    <h3></h3>
                    <figcaption data-value={this.getMessage()}></figcaption>
                    <button onClick={() => this.props.dismissMessageBox()}>Dismiss</button>
                </figure>
            </>
        )
    }
}