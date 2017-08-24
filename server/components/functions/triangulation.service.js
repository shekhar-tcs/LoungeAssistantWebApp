
'use strict';

exports.getCoordinates = function (xA, yA, rA, xB, yB, rB, xC, yC, rC, count) {
    var pred = [];

    count = count || 1;

    if (count == 4)
    {
        pred={'x':1000,'y':1000};
        return pred;
    }

    // console.log(xA,yA,rA,xB,yB,rB,xC,yC,rC);

    var d = Math.sqrt((xB-xA)*(xB-xA)+(yB-yA)*(yB-yA));
    var K = (1/4)*Math.sqrt(((rA+rB)*(rA+rB)-d*d)*(d*d-(rA-rB)*(rA-rB)));

    if (rA+rB < d)
    {
        // console.log("dont meet");
        count = count + 1;
        pred = this.getCoordinates(xB,yB,rB,xC,yC,rC,xA,yA,rA,count);
    }
    else if(d < Math.abs(rA-rB))
    {
        // console.log("inside");
        count = count + 1;
        pred = this.getCoordinates(xB,yB,rB,xC,yC,rC,xA,yA,rA,count);
    }
    else
    {
        var x1 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) + 2*(yB-yA)*K/(d*d);
        var y1 = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) + -2*(xB-xA)*K/(d*d);

        var x2 = (1/2)*(xB+xA) + (1/2)*(xB-xA)*(rA*rA-rB*rB)/(d*d) - 2*(yB-yA)*K/(d*d);
        var y2  = (1/2)*(yB+yA) + (1/2)*(yB-yA)*(rA*rA-rB*rB)/(d*d) - -2*(xB-xA)*K/(d*d);


        // if (xC && yC && rC)
        // {
        var d31 = Math.sqrt((xC-x1)*(xC-x1)+(yC-y1)*(yC-y1));
        var d32 = Math.sqrt((xC-x2)*(xC-x2)+(yC-y2)*(yC-y2));
        if (Math.abs(d31-rC) < Math.abs(d32-rC))
        {
            pred={'x':x1,'y':y1};
        }
        else {
            pred={'x':x2,'y':y2};
        }
        // }
        // else {
        //   pred={'x':x1,'y':y1};
        //   pred={'x':x2,'y':y2};
        // }
    }
    return pred;
}
