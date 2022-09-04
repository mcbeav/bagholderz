import React from "react";

interface Props
    {
        displayPrice: string;
        maxSupply: number;
        totalSupply: number;
    }

interface State
    {

    }

const defaultState: State =
    {

    }

export default class CollectionStatus extends React.Component<Props, State> {
    constructor( props: Props ) {
        super( props );

        this.state = defaultState;
    }

    private formatSupply(): string
        {
            let display = null;

            if( this.props.totalSupply !== null && this.props.totalSupply !== 0 ) {
                display = Number( this.props.maxSupply ) - Number( this.props.totalSupply );
            } else {
                display = "-";
            }

            return String( display );
        }

    render() {
        return (
            <>
                <figcaption>
                    <ul>
                        <li><span>remaining:</span></li>
                        <li><span>price:</span></li>
                    </ul>
                    <ul>
                        <li><span data-value={this.formatSupply()}></span></li>
                        <li>
                            <span data-value={this.props.displayPrice}></span>
                            <picture>
                            <svg xmlns="http://www.w3.org/2000/svg" imageRendering="optimizeQuality" shapeRendering="geometricPrecision" viewBox="0 0 64 64">
                                <path d="M32 1l-.4 1.4v41l.4.4 19-11.2z" opacity="0.7"/>
                                <path d="M32 1L13 32.6l19 11.2V23.9z" opacity="0.5"/>
                                <path d="M32 47.4l-.2.3v14.6l.2.7 19-26.8z" opacity="0.7"/>
                                <path d="M32 63V47.4L13 36.2z" opacity="0.5"/>
                            </svg>
                            </picture>
                        </li>
                    </ul>
                </figcaption>
            </>
        )
    }
}