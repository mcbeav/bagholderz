import React from "react";

interface Props
    {
        userAddress: string|null;
    }

interface State
    {

    }

const defaultState: State = 
    {

    }

export default class ConnectedWallet extends React.Component<Props, State> {
    constructor( props: Props ) {
        super( props );

        this.state = defaultState;
    }

    private isWalletConnected(): boolean
        {
            return this.props.userAddress !== null;
        }

        render() {
            return (
                <>
                    <figure>
                        <h3>wallet:</h3>
                        <figcaption data-value={this.isWalletConnected() ? this.props.userAddress : 'not connected'}></figcaption>
                    </figure>
                </>
            )
        }
}