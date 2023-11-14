import http from 'k6/http';
import { sleep, check } from 'k6';
import { SharedArray } from 'k6/data';
import { Counter, Gauge, Rate, Trend } from 'k6/metrics';

const customTrend = new Trend("custom_duration");
const customCounter = new Counter("custom_counter");
const customGauge = new Gauge("custom_gauge");
const customRate = new Rate("custom_rate");

export let options = {
    vus: 1,
    duration: '10s',
    // scenarios: {
    //     per_vu_scenario: {
    //         executor: "per-vu-iterations",
    //         vus: 2,
    //         iterations: 2,
    //         startTime: '3s'
    //     },
    //     shared_scenario: {
    //         executor: "shared-iterations",
    //         vus: 2,
    //         iterations: 4,
    //         startTime: '0s'
    //     },
    //     constant_scenario: {
    //         executor: "constant-vus",
    //         vus: 2,
    //         duration: '5s',
    //         startTime: '0s'
    //     },
    //     constant_arrival_scenario: {
    //         executor: "constant-arrival-rate",
    //         rate: 5,
    //         duration: '20s',
    //         preAllocatedVUs: 5,
    //         maxVUs: 10
    //     },
    //     ramping_arrival_scenario: {
    //         executor: "ramping-arrival-rate",
    //         startRate: 2,
    //         timeUnit: '1s',
    //         preAllocatedVUs: 2,
    //         maxVUs: 5,
    //         stages: [
    //             {
    //                 target: 15,
    //                 duration: "30s"
    //             }
    //         ]
    //     },
    //     ramping_vus_scenario: {
    //         executor: "ramping-vus",
    //         startTime: '0s',
    //         stages: [
    //             {
    //                 target: 5,
    //                 duration: "15s"
    //             }
    //         ]
    //     },
    //     externally_controller_scenario: {
    //         executor: "externally-controlled",
    //         duration: '3m',
    //         vus: 10,
    //         maxVUs: 30
    //     },
    // },
    thresholds: {
        http_req_duration: [
            {
                threshold: 'p(95) < 100',
                abortOnFail: true
            }
        ]
    }
}

export default function () {
    let res = http.get('http://test.k6.io');
    check(res, {
        'is status 200': r => r.status === 201
    });
    console.log(res.status);

    console.log('Response time (ms) was ' + String(res.timings.duration));
    customTrend.add(res.timings.duration);
    customCounter.add(1);
    customRate.add(true);
    customRate.add(0);
    customGauge.add(1);
    customGauge.add(5);
    customGauge.add(10);
    sleep(5);
}

// Shared array
const testData = new SharedArray("datas", () => {
    return JSON.parse(open('./test_data_1.json')).datas;
})