import React from 'react';
import covidData from './states.json';
import { Line } from 'react-chartjs-2';
import * as moment from 'moment';
import {FlexGrid, FlexGridItem} from 'baseui/flex-grid';
import {
    Card,
    StyledBody,
    StyledTitle
  } from "baseui/card";

const _ = require('lodash');

export default () => {


    const chartItems = () => {

        const items = [];

        covidData.states.forEach((stateData) => {

            
            const point_data = [];


            for (const [key, value] of Object.entries(stateData.predictions[0])) {
                point_data.push({
                   t: moment(key, 'MM-DD-YYYY').toDate(),
                   y: parseFloat(value)
                });
              }
        
            const data = {
        
                datasets: [{
                    label: '# of cases',
                    data: point_data,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
        
                }]
            }
        
            const options = {
                scales: {
                  xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'day'
                    }
                }]
                },
              }

              items.push( <FlexGridItem>
                <Card
                    title= {stateData.name}
                >
                    <StyledBody>
                        <Line data={data} options={options} />
                    </StyledBody>
                </Card>
                
            </FlexGridItem>)

        });

        return items;
    }

   
    




    return (
    <div>
    <FlexGrid
        style={{
            margin: 16,
        }}
        flexGridColumnCount={3}
        flexGridColumnGap="scale800"
        flexGridRowGap="scale800"
    >
        {chartItems()}
  </FlexGrid>
         
    </div>);
}