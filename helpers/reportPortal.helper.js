import reporter from 'wdio-reportportal-reporter';

const scriptName = process.env.npm_lifecycle_event;
const reportPortalProject = 'trade_logiq';
const launchName = `${scriptName}_ui`;
const reportPortalDomain = 'https://rtportal.devopdata.co/api/v1/';
/* use TAG env variable for 'ci' and 'regression' test runs */
const TAG = process.env.TAG;

class ReportPortalHelper {
  getReportConfig() {
    return {
      reportPortalClientConfig: {
        token: 'cccfcc8e-eb46-4121-9cf3-2f06d470196e',
        endpoint: 'https://rtportal.devopdata.co/api/v1',
        launch: launchName,
        project: `${reportPortalProject}`,
        mode: 'DEFAULT',
        debug: false,
        attributes: TAG !== undefined ? [{ key: 'tag', value: TAG }] : [],
      },
      reportSeleniumCommands: false, // add selenium commands to log
      seleniumCommandsLogLevel: 'info', // log level for selenium commands
      // autoAttachScreenshots: false, // TODO to investigate why it stopped working
      screenshotsLogLevel: 'info', // log level for screenshots
      parseTagsFromTestTitle: false, // parse strings like `@foo` from titles and add to Report Portal
      sanitizeErrorMessages: true, // strip color ascii characters from error stacktrace
    };
  }

  async logInfo(message) {
    console.log(message);
    reporter.sendLog('info', message);
  }

  getTestIdFromTitle(test) {
    return test.title.split(' ')[0];
  }

  getLatestLaunch(agent) {
    const headers = {
      Authorization: `bearer ${this.getReportConfig().reportPortalClientConfig.token}`,
      'Content-Type': 'application/json',
    };
    return agent
      .get(`${reportPortalDomain}${reportPortalProject}/launch/latest?filter.eq.name=${launchName}`)
      .set(headers)
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.getLatestLaunch res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.getLatestLaunch status code error: ${JSON.stringify(res.body)}`);
        return res;
      })
      .catch((err) => {
        console.log(`reportHelper.getLatestLaunch err: ${JSON.stringify(err)}`);
      });
  }

  finishLaunch(agent, uuid, endTime) {
    const headers = {
      Authorization: `bearer ${this.getReportConfig().reportPortalClientConfig.token}`,
      'Content-Type': 'application/json',
    };
    return agent
      .put(`${reportPortalDomain}${reportPortalProject}/launch/${uuid}/finish`)
      .set(headers)
      .send({
        endTime: `${endTime}`,
      })
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.finishLaunch res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.finishLaunch status code error: ${JSON.stringify(res.body)}`);
        return res;
      })
      .catch((err) => {
        console.log(`reportHelper.finishLaunch err: ${JSON.stringify(err)}`);
      });
  }

  getPreviousLaunch(agent, launchName) {
    const headers = {
      Authorization: `bearer ${this.getReportConfig().reportPortalClientConfig.token}`,
      'Content-Type': 'application/json',
    };
    return agent
      .get(
        `${reportPortalDomain}${reportPortalProject}/launch?page.size=1&filter.any.compositeAttribute=tag%3Aci%2Ctag%3Aregression&page.sort=startTime%2Cnumber%2CDESC&filter.eq.name=${launchName}`
      )
      .set(headers)
      .then((res) => {
        res.statusCode === 200
          ? console.log(`reportHelper.getPreviousLaunch res: ${JSON.stringify(res.body)}`)
          : console.log(`reportHelper.getPreviousLaunch status code error: ${JSON.stringify(res.body)}`);
        return res;
      })
      .catch((err) => {
        console.log(`reportHelper.getPreviousLaunch err: ${JSON.stringify(err)}`);
      });
  }
}

export const reportPortalHelper = new ReportPortalHelper();
