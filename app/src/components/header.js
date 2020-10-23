import React, {useState, useEffect} from "react";
import {
  AppNavBar,
  setItemActive
} from "baseui/app-nav-bar";
import { useHistory } from 'react-router-dom';

export default (props) => {

  const { account, roles } = props;
  const [mainItems, setMainItems] = useState([]);

  const history = useHistory();

  useEffect(() => {

    console.log("roles: ", roles);

    const items = [];

    roles.forEach((item) => {
      if (item.status){
        items.push({label: item.role});
      }
    });
    const d = roles.find((o) => o.role === 'designer');
    const m = roles.find((o) => o.role === 'manufacturer');
    if (d.status || m.status) {
      items.push({label: 'owner'});
    }
    
    setMainItems(items);
  }, [roles]);
    
 
  return (
    <AppNavBar
      title="Vaccine/Drug Supply Chain"
      mainItems={mainItems}
      onMainItemSelect={item => {
        setMainItems(prev => setItemActive(prev, item));
        history.push(`/${item.label}`);

      }}
      username={account}
      onUserItemSelect={item => console.log(item)}
    />
  );
}