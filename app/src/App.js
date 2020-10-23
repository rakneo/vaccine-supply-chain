import React, {useEffect, useState} from 'react';
import { useWeb3Context } from 'web3-react'
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled, DarkTheme} from 'baseui';
import {
    SnackbarProvider, PLACEMENT
  } from 'baseui/snackbar';
import Router from './routes';
import useInstance from './hooks/useInstance';
import API from './utils/contract-api';

const engine = new Styletron();

export default function App() {
	const context = useWeb3Context();
	const [roles, setRoles] = useState([]);
	const [api, setApi] = useState(null);
	const [isLoading, setIsLoading] = useState(true);



	const instance = useInstance();

	useEffect(() => {
		if(instance != null) {
			setApi(new API(instance), context);
		}
	}, [instance]);



	useEffect(() => {
		if (instance != null && api != null){
			api.currentAccountRoles(context.account).then((r) => {
					setRoles(r);
					setIsLoading(false);
				}
			);
		}	
	}, [context.account, instance, api])

	
	

  
	return (
		(!isLoading)
		?
		<StyletronProvider value={engine}>
			<BaseProvider theme={LightTheme}>
				<SnackbarProvider placement={PLACEMENT.bottomRight} >
					<Router roles={roles}/>
				</SnackbarProvider>
			</BaseProvider>
		</StyletronProvider>
		:
		<div>
			Loading...
		</div>
	);
}