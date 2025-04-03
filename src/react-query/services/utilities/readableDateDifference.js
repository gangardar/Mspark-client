import moment from "moment";

const readableDateDifference = ({start , end}) => {
    const startDate = moment(start);
    const endDate = moment(end);

    const differenceInMs = endDate.diff(startDate);
    const duration = moment.duration(differenceInMs);
    const humanizeDuration = duration.humanize();
    return humanizeDuration

}

export default readableDateDifference;