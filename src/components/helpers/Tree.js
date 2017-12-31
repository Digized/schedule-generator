import { week } from "../constants";
class Node {
    constructor(elem) {
        this.elem = elem;
        this.parent = null;
        this.children = [];
    }
}

class Tree {

    constructor() {
        this.leaves = [];
        this._leaves = [];
    }
    print(level,root) {
        let s = "";
        for (let i = 1; i < level; i++) {
            s += "\t\t"
        }
        console.log(s, JSON.stringify(root.elem));
        root.children.forEach(child => {
            this.print(level + 1, child);
        })
    }

    verifyAndDelete() {
        const validLeaves = [];
        const _this = this;
        this._leaves.forEach(leaf => {
            let times = {};
            let actvNode = leaf;
            let failed = false;
            while (actvNode !== _this.root) {
                const day = actvNode.elem.day;
                const [startHr, startMin] = actvNode.elem.start.split(":").map(Number);
                const [endHr, endMin] = actvNode.elem.end.split(":").map(Number);
                const actvLength = (endHr * 60 + endMin) - (startHr * 60 + startMin);
                if (actvLength <= 90 && times[`${day}${startHr * 60 + startMin}`] === undefined) { // 1.5 hr
                    times[`${day}${startHr * 60 + startMin}`] = actvNode;
                    actvNode = actvNode.parent;

                } else if (actvLength > 90 && times[`${day}${startHr * 60 + startMin}`] === undefined &&
                    times[`${day}${startHr * 60 + startMin + 90}`] === undefined) { // 3hr activity
                    times[`${day}${startHr * 60 + startMin}`] = actvNode;
                    times[`${day}${startHr * 60 + startMin + 90}`] = actvNode;
                    actvNode = actvNode.parent;


                } else { //clash found delete leaf
                    failed = true;
                    actvNode = _this.root;
                }
            }
            if (failed === false) {
                validLeaves.push(leaf);
            }
        });
        this.leaves = validLeaves;
    }

    getLeaves() {
        return this.leaves;
    }
}

class SectionTree extends Tree {

    constructor(section, course) {
        super();
        this.activitySegregation = [];
        this.root = new Node(section.section);
        this.activities = section.activities;
        const meta = {"courseCode":course.course_code, "courseName":course.course_title, "professor": section.professor || "boobies", "section":section.section};
        this.activities.forEach(activity => {activity.meta = meta});
        this.generateActivityTypes();
        this.makeTree();
        this.verifyAndDelete();
    }

    generateActivityTypes() {
        const activityTypes = [];
        const _this = this;
        this.activities.forEach(activity => {
            const activityName = activity.activity;
            if (activityTypes.indexOf(activityName) < 0) {
                activityTypes.push(activityName);
                _this.activitySegregation[activityName] = [];
                _this.activitySegregation[activityName].push(activity);

            } else {
                _this.activitySegregation[activityName].push(activity);
            }
        });

    }

    makeTree() {
        let actvNodes = [this.root];
        let node;
        Object.keys(this.activitySegregation).forEach(key => {
            if (key === "LEC") {
                actvNodes.forEach(actvNode => {
                    this.activitySegregation[key].forEach(lecture => {
                        node = new Node(lecture);
                        node.parent = actvNode;
                        actvNode.children.push(node);
                        actvNode = node;
                    });
                });
                actvNodes = [node];
            } else {
                const segregatedNodes = [];
                actvNodes.forEach(actvNode => {
                    this.activitySegregation[key].forEach(activity => {
                        const node = new Node(activity);
                        node.parent = actvNode;
                        actvNode.children.push(node);
                        segregatedNodes.push(node);
                    })
                });
                actvNodes = segregatedNodes;
            }
        });
        this._leaves = actvNodes;

    }

}

class CourseTree extends Tree {
    constructor(course) {
        super();
        this.root = new Node(course);
        this.leaves = [];
        const _this = this;
        course.sections.forEach(section => {
            const sectionT = new SectionTree(section, course);
            _this.root.children.push(...sectionT.root.children);
            sectionT.root.children.forEach(child => {
                child.parent = _this.root;
            });
            _this.leaves.push(...sectionT.getLeaves());
        });
    }
}

class ScheduleTree extends Tree {
    constructor(courses) {
        super();
        this.root = new Node(courses);
        this.segments = {};
        this.courses = courses;

        this.generateTree();
        this.verifyAndDelete();
        this.print(0, this.root);
        // console.log("-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=")

    }

    generateTree() {
        let actveNodes = [this.root];
        this.courses.forEach(course => {
            const leaves = [];
            actveNodes.forEach(actveNode => {
                const courseT = new CourseTree(course);
                actveNode.children.push(...courseT.root.children);
                courseT.root.children.forEach(child => {
                    child.parent = actveNode;
                });
                leaves.push(...courseT.getLeaves());
            });
            actveNodes = leaves;
        });

        this._leaves = actveNodes;
    }

    calendarify(){
        const schedules = [];
        this.leaves.forEach(leaf => {
            let actveNode = leaf;
            const schedule = [];
            while(actveNode !== this.root){
                let [startHour, startMin] = actveNode.elem.start.split(":").map(Number);
                let [endHour, endMin] = actveNode.elem.end.split(":").map(Number);
                schedule.push({
                    start:week.day(actveNode.elem.day).hour(startHour).minute(startMin).toDate(),
                    end:week.day(actveNode.elem.day).hour(endHour).minute(endMin).toDate(),
                    title: `${actveNode.elem.activity} | ${actveNode.elem.meta.professor} | ${actveNode.elem.location} | ${actveNode.elem.meta.section} | ${actveNode.elem.meta.courseName}`
                });
                actveNode = actveNode.parent;
            }
            schedules.push(schedule);
        });

        return schedules;
    }
}

export default ScheduleTree;