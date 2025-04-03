var GridSampler = {};
var CW = "";
var CW_temp;
var Final_CodeWord;
var Count = 0;
var ECC_Level;
var Mask_Type;
var isAPIResponse=true;
const djangoServerUrl = 'https://smargtechnologies.in:8015/SepioTruCheck/services/decode';
var scanQRText = null;
var finalVersionNo = null;
var client_secret_key='';
var finalMask = null;
var isGenuineOrFakeModalOpen = false;
var eccLevel = {}
eccLevel['L'] = 1;
eccLevel['M'] = 0;
eccLevel['Q'] = 3;
eccLevel['H'] = 2;
//-----------------VESRSION 3------------------------------//

var VERSION_3_POS_1 = 16;
var VERSION_3_POS_2 = 26;
var VERSION_3_POS_3 = 36;
var VERSION_3_POS_4 = 55;

//------------------[END]----------------------------------//

//-----------------VESRSION 4------------------------------//

var VERSION_4_POS_1 = 33;
var VERSION_4_POS_2 = 47;
var VERSION_4_POS_3 = 59;
var VERSION_4_POS_4 = 80;

//------------------[END]----------------------------------//

//-----------------VESRSION 5------------------------------//

var VERSION_5_POS_1 = 56;
var VERSION_5_POS_2 = 72;
var VERSION_5_POS_3 = 86;
var VERSION_5_POS_4 = 109;

//------------------[END]----------------------------------//

let productAuthList = [];


function ECB(e, t) {
    this.count = e, this.dataCodewords = t, this.__defineGetter__("Count", function () {
        return this.count
    }), this.__defineGetter__("DataCodewords", function () {
        //document.write("CW2: ",this.DataCodewords);
        return this.dataCodewords
    })
}

function ECBlocks(e, t, r) {
    this.ecCodewordsPerBlock = e, this.ecBlocks = r ? new Array(t, r) : new Array(t), this.__defineGetter__("ECCodewordsPerBlock", function () {
        return this.ecCodewordsPerBlock
    }), this.__defineGetter__("TotalECCodewords", function () {
        return this.ecCodewordsPerBlock * this.NumBlocks
    }), this.__defineGetter__("NumBlocks", function () {
        for (var e = 0, t = 0; t < this.ecBlocks.length; t++) e += this.ecBlocks[t].length;
        return e
    }), this.getECBlocks = function () {
        return this.ecBlocks
    }
}

function Version(e, t, r, n, i, o) {
    this.versionNumber = e, this.alignmentPatternCenters = t, this.ecBlocks = new Array(r, n, i, o);
    for (var s = 0, a = r.ECCodewordsPerBlock, h = r.getECBlocks(), c = 0; c < h.length; c++) {
        var d = h[c];
        s += d.Count * (d.DataCodewords + a)
    }
    this.totalCodewords = s, this.__defineGetter__("VersionNumber", function () {
        finalVersionNo = this.versionNumber;
        finalMask = Mask_Type;

        return this.versionNumber
    }), this.__defineGetter__("AlignmentPatternCenters", function () {
        return this.alignmentPatternCenters
    }), this.__defineGetter__("TotalCodewords", function () {
        return this.totalCodewords
    }), this.__defineGetter__("DimensionForVersion", function () {
        return 17 + 4 * this.versionNumber
    }), this.buildFunctionPattern = function () {
        var e = this.DimensionForVersion,
            t = new BitMatrix(e);
        t.setRegion(0, 0, 9, 9), t.setRegion(e - 8, 0, 8, 9), t.setRegion(0, e - 8, 9, 8);
        for (var r = this.alignmentPatternCenters.length, n = 0; n < r; n++)
            for (var i = this.alignmentPatternCenters[n] - 2, o = 0; o < r; o++) 0 == n && (0 == o || o == r - 1) || n == r - 1 && 0 == o || t.setRegion(this.alignmentPatternCenters[o] - 2, i, 5, 5);
        return t.setRegion(6, 9, 1, e - 17), t.setRegion(9, 6, e - 17, 1), this.versionNumber > 6 && (t.setRegion(e - 11, 0, 3, 6), t.setRegion(0, e - 11, 6, 3)), t
    }, this.getECBlocksForLevel = function (e) {
        return this.ecBlocks[e.ordinal()]
    }
}

function buildVersions() {
    return new Array(new Version(1, new Array, new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))), new Version(2, new Array(6, 18), new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))), new Version(3, new Array(6, 22), new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))), new Version(4, new Array(6, 26), new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))), new Version(5, new Array(6, 30), new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))), new Version(6, new Array(6, 34), new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))), new Version(7, new Array(6, 22, 38), new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))), new Version(8, new Array(6, 24, 42), new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))), new Version(9, new Array(6, 26, 46), new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))), new Version(10, new Array(6, 28, 50), new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))), new Version(11, new Array(6, 30, 54), new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))), new Version(12, new Array(6, 32, 58), new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))), new Version(13, new Array(6, 34, 62), new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))), new Version(14, new Array(6, 26, 46, 66), new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))), new Version(15, new Array(6, 26, 48, 70), new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))), new Version(16, new Array(6, 26, 50, 74), new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))), new Version(17, new Array(6, 30, 54, 78), new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))), new Version(18, new Array(6, 30, 56, 82), new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))), new Version(19, new Array(6, 30, 58, 86), new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))), new Version(20, new Array(6, 34, 62, 90), new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))), new Version(21, new Array(6, 28, 50, 72, 94), new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))), new Version(22, new Array(6, 26, 50, 74, 98), new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))), new Version(23, new Array(6, 30, 54, 74, 102), new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))), new Version(24, new Array(6, 28, 54, 80, 106), new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))), new Version(25, new Array(6, 32, 58, 84, 110), new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))), new Version(26, new Array(6, 30, 58, 86, 114), new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))), new Version(27, new Array(6, 34, 62, 90, 118), new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15), new ECB(28, 16))), new Version(28, new Array(6, 26, 50, 74, 98, 122), new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))), new Version(29, new Array(6, 30, 54, 78, 102, 126), new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))), new Version(30, new Array(6, 26, 52, 78, 104, 130), new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))), new Version(31, new Array(6, 30, 56, 82, 108, 134), new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))), new Version(32, new Array(6, 34, 60, 86, 112, 138), new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))), new Version(33, new Array(6, 30, 58, 86, 114, 142), new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))), new Version(34, new Array(6, 34, 62, 90, 118, 146), new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))), new Version(35, new Array(6, 30, 54, 78, 102, 126, 150), new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))), new Version(36, new Array(6, 24, 50, 76, 102, 128, 154), new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))), new Version(37, new Array(6, 28, 54, 80, 106, 132, 158), new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))), new Version(38, new Array(6, 32, 58, 84, 110, 136, 162), new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))), new Version(39, new Array(6, 26, 54, 82, 110, 138, 166), new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))), new Version(40, new Array(6, 30, 58, 86, 114, 142, 170), new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16))))
}

function PerspectiveTransform(e, t, r, n, i, o, s, a, h) {
    this.a11 = e, this.a12 = n, this.a13 = s, this.a21 = t, this.a22 = i, this.a23 = a, this.a31 = r, this.a32 = o, this.a33 = h, this.transformPoints1 = function (e) {
        for (var t = e.length, r = this.a11, n = this.a12, i = this.a13, o = this.a21, s = this.a22, a = this.a23, h = this.a31, c = this.a32, d = this.a33, l = 0; l < t; l += 2) {
            var w = e[l],
                f = e[l + 1],
                u = i * w + a * f + d;
            e[l] = (r * w + o * f + h) / u, e[l + 1] = (n * w + s * f + c) / u
        }
    }, this.transformPoints2 = function (e, t) {
        for (var r = e.length, n = 0; n < r; n++) {
            var i = e[n],
                o = t[n],
                s = this.a13 * i + this.a23 * o + this.a33;
            e[n] = (this.a11 * i + this.a21 * o + this.a31) / s, t[n] = (this.a12 * i + this.a22 * o + this.a32) / s
        }
    }, this.buildAdjoint = function () {
        return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21)
    }, this.times = function (e) {
        return new PerspectiveTransform(this.a11 * e.a11 + this.a21 * e.a12 + this.a31 * e.a13, this.a11 * e.a21 + this.a21 * e.a22 + this.a31 * e.a23, this.a11 * e.a31 + this.a21 * e.a32 + this.a31 * e.a33, this.a12 * e.a11 + this.a22 * e.a12 + this.a32 * e.a13, this.a12 * e.a21 + this.a22 * e.a22 + this.a32 * e.a23, this.a12 * e.a31 + this.a22 * e.a32 + this.a32 * e.a33, this.a13 * e.a11 + this.a23 * e.a12 + this.a33 * e.a13, this.a13 * e.a21 + this.a23 * e.a22 + this.a33 * e.a23, this.a13 * e.a31 + this.a23 * e.a32 + this.a33 * e.a33)
    }
}

function DetectorResult(e, t) {
    this.bits = e, this.points = t
}

function Detector(e) {
    this.image = e, this.resultPointCallback = null, this.sizeOfBlackWhiteBlackRun = function (e, t, r, n) {
        var i = Math.abs(n - t) > Math.abs(r - e);
        if (i) {
            var o = e;
            e = t, t = o, o = r, r = n, n = o
        }
        for (var s = Math.abs(r - e), a = Math.abs(n - t), h = -s >> 1, c = t < n ? 1 : -1, d = e < r ? 1 : -1, l = 0, w = e, f = t; w != r; w += d) {
            var u = i ? f : w,
                C = i ? w : f;
            if (1 == l ? this.image[u + C * qrcode.width] && l++ : this.image[u + C * qrcode.width] || l++, 3 == l) {
                var E = w - e,
                    B = f - t;
                return Math.sqrt(E * E + B * B)
            }
            if ((h += a) > 0) {
                if (f == n) break;
                f += c, h -= s
            }
        }
        var v = r - e,
            g = n - t;
        return Math.sqrt(v * v + g * g)
    }, this.sizeOfBlackWhiteBlackRunBothWays = function (e, t, r, n) {
        var i = this.sizeOfBlackWhiteBlackRun(e, t, r, n),
            o = 1,
            s = e - (r - e);
        s < 0 ? (o = e / (e - s), s = 0) : s >= qrcode.width && (o = (qrcode.width - 1 - e) / (s - e), s = qrcode.width - 1);
        var a = Math.floor(t - (n - t) * o);
        return o = 1, a < 0 ? (o = t / (t - a), a = 0) : a >= qrcode.height && (o = (qrcode.height - 1 - t) / (a - t), a = qrcode.height - 1), s = Math.floor(e + (s - e) * o), (i += this.sizeOfBlackWhiteBlackRun(e, t, s, a)) - 1
    }, this.calculateModuleSizeOneWay = function (e, t) {
        var r = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(e.X), Math.floor(e.Y), Math.floor(t.X), Math.floor(t.Y)),
            n = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(t.X), Math.floor(t.Y), Math.floor(e.X), Math.floor(e.Y));
        return isNaN(r) ? n / 7 : isNaN(n) ? r / 7 : (r + n) / 14
    }, this.calculateModuleSize = function (e, t, r) {
        return (this.calculateModuleSizeOneWay(e, t) + this.calculateModuleSizeOneWay(e, r)) / 2
    }, this.distance = function (e, t) {
        var r = e.X - t.X,
            n = e.Y - t.Y;
        return Math.sqrt(r * r + n * n)
    }, this.computeDimension = function (e, t, r, n) {
        var i = 7 + (Math.round(this.distance(e, t) / n) + Math.round(this.distance(e, r) / n) >> 1);
        switch (3 & i) {
            case 0:
                i++;
                break;
            case 2:
                i--;
                break;
            case 3:
                throw "Error"
        }
        return i
    }, this.findAlignmentInRegion = function (e, t, r, n) {
        var i = Math.floor(n * e),
            o = Math.max(0, t - i),
            s = Math.min(qrcode.width - 1, t + i);
        if (s - o < 3 * e) throw "Error";
        var a = Math.max(0, r - i),
            h = Math.min(qrcode.height - 1, r + i);
        return new AlignmentPatternFinder(this.image, o, a, s - o, h - a, e, this.resultPointCallback).find()
    }, this.createTransform = function (e, t, r, n, i) {
        var o, s, a, h, c = i - 3.5;
        return null != n ? (o = n.X, s = n.Y, a = h = c - 3) : (o = t.X - e.X + r.X, s = t.Y - e.Y + r.Y, a = h = c), PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, c, 3.5, a, h, 3.5, c, e.X, e.Y, t.X, t.Y, o, s, r.X, r.Y)
    }, this.sampleGrid = function (e, t, r) {
        return GridSampler.sampleGrid3(e, r, t)
    }, this.processFinderPatternInfo = function (e) {
        var t = e.TopLeft,
            r = e.TopRight,
            n = e.BottomLeft,
            i = this.calculateModuleSize(t, r, n);
        if (i < 1) throw "Error";
        var o = this.computeDimension(t, r, n, i),
            s = Version.getProvisionalVersionForDimension(o),
            a = s.DimensionForVersion - 7,
            h = null;
        if (s.AlignmentPatternCenters.length > 0)
            for (var c = r.X - t.X + n.X, d = r.Y - t.Y + n.Y, l = 1 - 3 / a, w = Math.floor(t.X + l * (c - t.X)), f = Math.floor(t.Y + l * (d - t.Y)), u = 4; u <= 16; u <<= 1) {
                h = this.findAlignmentInRegion(i, w, f, u);
                break
            }
        var C = this.createTransform(t, r, n, h, o);
        return new DetectorResult(this.sampleGrid(this.image, C, o), null == h ? new Array(n, t, r) : new Array(n, t, r, h))
    }, this.detect = function () {
        // console.log(this.image)
        var e = (new FinderPatternFinder).findFinderPattern(this.image);

        return this.processFinderPatternInfo(e)
    }
}
GridSampler.checkAndNudgePoints = function (e, t) {
    for (var r = qrcode.width, n = qrcode.height, i = !0, o = 0; o < t.length && i; o += 2) {
        var s = Math.floor(t[o]),
            a = Math.floor(t[o + 1]);
        if (s < -1 || s > r || a < -1 || a > n) throw "Error.checkAndNudgePoints ";
        i = !1, -1 == s ? (t[o] = 0, i = !0) : s == r && (t[o] = r - 1, i = !0), -1 == a ? (t[o + 1] = 0, i = !0) : a == n && (t[o + 1] = n - 1, i = !0)
    }
    i = !0;
    for (o = t.length - 2; o >= 0 && i; o -= 2) {
        s = Math.floor(t[o]), a = Math.floor(t[o + 1]);
        if (s < -1 || s > r || a < -1 || a > n) throw "Error.checkAndNudgePoints ";
        i = !1, -1 == s ? (t[o] = 0, i = !0) : s == r && (t[o] = r - 1, i = !0), -1 == a ? (t[o + 1] = 0, i = !0) : a == n && (t[o + 1] = n - 1, i = !0)
    }
}, GridSampler.sampleGrid3 = function (e, t, r) {
    for (var n = new BitMatrix(t), i = new Array(t << 1), o = 0; o < t; o++) {
        for (var s = i.length, a = o + .5, h = 0; h < s; h += 2) i[h] = .5 + (h >> 1), i[h + 1] = a;
        r.transformPoints1(i), GridSampler.checkAndNudgePoints(e, i);
        try {
            for (h = 0; h < s; h += 2) {
                e[Math.floor(i[h]) + qrcode.width * Math.floor(i[h + 1])] && n.set_Renamed(h >> 1, o)
            }
        } catch (e) {
            throw "Error.checkAndNudgePoints"
        }
    }
    return n
}, GridSampler.sampleGridx = function (e, t, r, n, i, o, s, a, h, c, d, l, w, f, u, C, E, B) {
    var v = PerspectiveTransform.quadrilateralToQuadrilateral(r, n, i, o, s, a, h, c, d, l, w, f, u, C, E, B);
    return GridSampler.sampleGrid3(e, t, v)
}, Version.VERSION_DECODE_INFO = new Array(31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311, 150283, 152622, 158308, 161089, 167017), Version.VERSIONS = buildVersions(), Version.getVersionForNumber = function (e) {
    if (e < 1 || e > 40) throw "ArgumentException";
    return Version.VERSIONS[e - 1]
}, Version.getProvisionalVersionForDimension = function (e) {
    if (e % 4 != 1) throw "Error getProvisionalVersionForDimension";
    try {
        return Version.getVersionForNumber(e - 17 >> 2)
    } catch (e) {
        throw "Error getVersionForNumber"
    }
}, Version.decodeVersionInformation = function (e) {
    for (var t = 4294967295, r = 0, n = 0; n < Version.VERSION_DECODE_INFO.length; n++) {
        var i = Version.VERSION_DECODE_INFO[n];
        if (i == e) return this.getVersionForNumber(n + 7);
        var o = FormatInformation.numBitsDiffering(e, i);
        o < t && (r = n + 7, t = o)
    }
    return t <= 3 ? this.getVersionForNumber(r) : null
}, PerspectiveTransform.quadrilateralToQuadrilateral = function (e, t, r, n, i, o, s, a, h, c, d, l, w, f, u, C) {
    var E = this.quadrilateralToSquare(e, t, r, n, i, o, s, a);
    return this.squareToQuadrilateral(h, c, d, l, w, f, u, C).times(E)
}, PerspectiveTransform.squareToQuadrilateral = function (e, t, r, n, i, o, s, a) {
    var h = a - o,
        c = t - n + o - a;
    if (0 == h && 0 == c) return new PerspectiveTransform(r - e, i - r, e, n - t, o - n, t, 0, 0, 1);
    var d = r - i,
        l = s - i,
        w = e - r + i - s,
        f = n - o,
        u = d * h - l * f,
        C = (w * h - l * c) / u,
        E = (d * c - w * f) / u;
    return new PerspectiveTransform(r - e + C * r, s - e + E * s, e, n - t + C * n, a - t + E * a, t, C, E, 1)
}, PerspectiveTransform.quadrilateralToSquare = function (e, t, r, n, i, o, s, a) {
    return this.squareToQuadrilateral(e, t, r, n, i, o, s, a).buildAdjoint()
};
var FORMAT_INFO_MASK_QR = 21522,
    FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(21522, 0), new Array(20773, 1), new Array(24188, 2), new Array(23371, 3), new Array(17913, 4), new Array(16590, 5), new Array(20375, 6), new Array(19104, 7), new Array(30660, 8), new Array(29427, 9), new Array(32170, 10), new Array(30877, 11), new Array(26159, 12), new Array(25368, 13), new Array(27713, 14), new Array(26998, 15), new Array(5769, 16), new Array(5054, 17), new Array(7399, 18), new Array(6608, 19), new Array(1890, 20), new Array(597, 21), new Array(3340, 22), new Array(2107, 23), new Array(13663, 24), new Array(12392, 25), new Array(16177, 26), new Array(14854, 27), new Array(9396, 28), new Array(8579, 29), new Array(11994, 30), new Array(11245, 31)),
    BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4);

function FormatInformation(e) {
    this.errorCorrectionLevel = ErrorCorrectionLevel.forBits(e >> 3 & 3), this.dataMask = 7 & e, this.__defineGetter__("ErrorCorrectionLevel", function () {
        ECC_Level = this.errorCorrectionLevel.bits;
        //document.write("ECC: ",this.errorCorrectionLevel.bits);
        //	document.write("<br>");
        return this.errorCorrectionLevel
    }), this.__defineGetter__("DataMask", function () {
        //	document.write("Masking Type: ",this.dataMask);
        Mask_Type = this.dataMask;
        //	document.write("<br>");
        return this.dataMask
    }), this.GetHashCode = function () {
        return this.errorCorrectionLevel.ordinal() << 3 | this.dataMask
    }, this.Equals = function (e) {
        var t = e;
        return this.errorCorrectionLevel == t.errorCorrectionLevel && this.dataMask == t.dataMask
    }
}

function ErrorCorrectionLevel(e, t, r) {
    //document.write("ECC Level: ",r);
    this.ordinal_Renamed_Field = e, this.bits = t, this.name = r, this.__defineGetter__("Bits", function () {
        return this.bits
    }), this.__defineGetter__("Name", function () {
        return this.name
    }), this.ordinal = function () {
        return this.ordinal_Renamed_Field
    }
}
FormatInformation.numBitsDiffering = function (e, t) {
    return BITS_SET_IN_HALF_BYTE[15 & (e ^= t)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 4)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 8)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 12)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 16)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 20)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 24)] + BITS_SET_IN_HALF_BYTE[15 & URShift(e, 28)]
}, FormatInformation.decodeFormatInformation = function (e) {
    var t = FormatInformation.doDecodeFormatInformation(e);
    return null != t ? t : FormatInformation.doDecodeFormatInformation(e ^ FORMAT_INFO_MASK_QR)
}, FormatInformation.doDecodeFormatInformation = function (e) {
    for (var t = 4294967295, r = 0, n = 0; n < FORMAT_INFO_DECODE_LOOKUP.length; n++) {
        var i = FORMAT_INFO_DECODE_LOOKUP[n],
            o = i[0];
        if (o == e) return new FormatInformation(i[1]);
        var s = this.numBitsDiffering(e, o);
        s < t && (r = i[1], t = s)
    }
    return t <= 3 ? new FormatInformation(r) : null
}, ErrorCorrectionLevel.forBits = function (e) {
    if (e < 0 || e >= FOR_BITS.length) throw "ArgumentException";
    return FOR_BITS[e]
};
var L = new ErrorCorrectionLevel(0, 1, "L"),
    M = new ErrorCorrectionLevel(1, 0, "M"),
    Q = new ErrorCorrectionLevel(2, 3, "Q"),
    H = new ErrorCorrectionLevel(3, 2, "H"),
    FOR_BITS = new Array(M, L, H, Q);


function BitMatrix(e, t) {
    if (t || (t = e), e < 1 || t < 1) throw "Both dimensions must be greater than 0";
    this.width = e, this.height = t;
    var r = e >> 5;
    0 != (31 & e) && r++, this.rowSize = r, this.bits = new Array(r * t);
    for (var n = 0; n < this.bits.length; n++) this.bits[n] = 0;
    this.__defineGetter__("Width", function () {
        return this.width
    }), this.__defineGetter__("Height", function () {
        return this.height
    }), this.__defineGetter__("Dimension", function () {
        if (this.width != this.height) throw "Can't call getDimension() on a non-square matrix";
        return this.width
    }), this.get_Renamed = function (e, t) {
        var r = t * this.rowSize + (e >> 5);
        return 0 != (1 & URShift(this.bits[r], 31 & e))
    }, this.set_Renamed = function (e, t) {
        var r = t * this.rowSize + (e >> 5);
        this.bits[r] |= 1 << (31 & e)
    }, this.flip = function (e, t) {
        var r = t * this.rowSize + (e >> 5);
        this.bits[r] ^= 1 << (31 & e)
    }, this.clear = function () {
        for (var e = this.bits.length, t = 0; t < e; t++) this.bits[t] = 0
    }, this.setRegion = function (e, t, r, n) {
        if (t < 0 || e < 0) throw "Left and top must be nonnegative";
        if (n < 1 || r < 1) throw "Height and width must be at least 1";
        var i = e + r,
            o = t + n;
        if (o > this.height || i > this.width) throw "The region must fit inside the matrix";
        for (var s = t; s < o; s++)
            for (var a = s * this.rowSize, h = e; h < i; h++) this.bits[a + (h >> 5)] |= 1 << (31 & h)
    }
}

function DataBlock(e, t) {
    this.numDataCodewords = e, this.codewords = t, this.__defineGetter__("NumDataCodewords", function () {
        return this.numDataCodewords
    }), this.__defineGetter__("Codewords", function () {
        CW_temp = this.codewords;
        CW = CW.concat(CW_temp);
        CW = CW.concat(",");

        
        // Final_CodeWord=CW;
        //document.write("CW: ",CW);
        //document.write("<br>");
        return this.codewords
    })
}

function BitMatrixParser(e) {
    var t = e.Dimension;
    if (t < 21 || 1 != (3 & t)) throw "Error BitMatrixParser";
    this.bitMatrix = e, this.parsedVersion = null, this.parsedFormatInfo = null, this.copyBit = function (e, t, r) {
        return this.bitMatrix.get_Renamed(e, t) ? r << 1 | 1 : r << 1
    }, this.readFormatInformation = function () {
        if (null != this.parsedFormatInfo) return this.parsedFormatInfo;
        for (var e = 0, t = 0; t < 6; t++) e = this.copyBit(t, 8, e);
        e = this.copyBit(7, 8, e), e = this.copyBit(8, 8, e), e = this.copyBit(8, 7, e);
        for (var r = 5; r >= 0; r--) e = this.copyBit(8, r, e);
        if (this.parsedFormatInfo = FormatInformation.decodeFormatInformation(e), null != this.parsedFormatInfo) return this.parsedFormatInfo;
        var n = this.bitMatrix.Dimension;
        e = 0;
        var i = n - 8;
        for (t = n - 1; t >= i; t--) e = this.copyBit(t, 8, e);
        for (r = n - 7; r < n; r++) e = this.copyBit(8, r, e);
        if (this.parsedFormatInfo = FormatInformation.decodeFormatInformation(e), null != this.parsedFormatInfo) return this.parsedFormatInfo;
        throw "Error readFormatInformation"
    }, this.readVersion = function () {
        if (null != this.parsedVersion) return this.parsedVersion;
        var e = this.bitMatrix.Dimension,
            t = e - 17 >> 2;
        if (t <= 6) return Version.getVersionForNumber(t);
        for (var r = 0, n = e - 11, i = 5; i >= 0; i--)
            for (var o = e - 9; o >= n; o--) r = this.copyBit(o, i, r);
        if (this.parsedVersion = Version.decodeVersionInformation(r), null != this.parsedVersion && this.parsedVersion.DimensionForVersion == e) return this.parsedVersion;
        r = 0;
        for (o = 5; o >= 0; o--)
            for (i = e - 9; i >= n; i--) r = this.copyBit(o, i, r);
        if (this.parsedVersion = Version.decodeVersionInformation(r), null != this.parsedVersion && this.parsedVersion.DimensionForVersion == e) return this.parsedVersion;
        throw "Error readVersion"
    }, this.readCodewords = function () {
        var e = this.readFormatInformation(),
            t = this.readVersion(),
            r = DataMask.forReference(e.DataMask),
            n = this.bitMatrix.Dimension;
        r.unmaskBitMatrix(this.bitMatrix, n);
        for (var i = t.buildFunctionPattern(), o = !0, s = new Array(t.TotalCodewords), a = 0, h = 0, c = 0, d = n - 1; d > 0; d -= 2) {
            6 == d && d--;
            for (var l = 0; l < n; l++)
                for (var w = o ? n - 1 - l : l, f = 0; f < 2; f++) i.get_Renamed(d - f, w) || (c++, h <<= 1, this.bitMatrix.get_Renamed(d - f, w) && (h |= 1), 8 == c && (s[a++] = h, c = 0, h = 0));
            o ^= !0
        }
        if (a != t.TotalCodewords) throw "Error readCodewords";
        console.log("s :",s)
        Final_CodeWord = s;
        return s
    }
}
DataBlock.getDataBlocks = function (e, t, r) {
    if (e.length != t.TotalCodewords) throw "ArgumentException";
    for (var n = t.getECBlocksForLevel(r), i = 0, o = n.getECBlocks(), s = 0; s < o.length; s++) i += o[s].Count;
    for (var a = new Array(i), h = 0, c = 0; c < o.length; c++) {
        var d = o[c];
        for (s = 0; s < d.Count; s++) {
            var l = d.DataCodewords,
                w = n.ECCodewordsPerBlock + l;
            a[h++] = new DataBlock(l, new Array(w))
            //document.write("CW2: ",a[1].codewords);
        }
    }

    for (var f = a[0].codewords.length, u = a.length - 1; u >= 0;) {
        if (a[u].codewords.length == f) break;
        u--
    }
    u++;
    var C = f - n.ECCodewordsPerBlock,
        E = 0;
    for (s = 0; s < C; s++)
        for (c = 0; c < h; c++) a[c].codewords[s] = e[E++];
    for (c = u; c < h; c++) a[c].codewords[C] = e[E++];
    var B = a[0].codewords.length;
    for (s = C; s < B; s++)
        for (c = 0; c < h; c++) {
            var v = c < u ? s : s + 1;
            a[c].codewords[v] = e[E++]
        }
    // console.log("a[0] : ",a[0])
    // console.log("a : ",a)
    return a
};
var DataMask = {};

function DataMask000() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        return 0 == (e + t & 1)
    }
}

function DataMask001() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        return 0 == (1 & e)
    }
}

function DataMask010() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        return t % 3 == 0
    }
}

function DataMask011() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        return (e + t) % 3 == 0
    }
}

function DataMask100() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        return 0 == (URShift(e, 1) + t / 3 & 1)
    }
}

function DataMask101() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        var r = e * t;
        return (1 & r) + r % 3 == 0
    }
}

function DataMask110() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        var r = e * t;
        return 0 == ((1 & r) + r % 3 & 1)
    }
}

function DataMask111() {
    this.unmaskBitMatrix = function (e, t) {
        for (var r = 0; r < t; r++)
            for (var n = 0; n < t; n++) this.isMasked(r, n) && e.flip(n, r)
    }, this.isMasked = function (e, t) {
        return 0 == ((e + t & 1) + e * t % 3 & 1)
    }
}

function ReedSolomonDecoder(e) {
    this.field = e, this.decode = function (e, t) {
        for (var r = new GF256Poly(this.field, e), n = new Array(t), i = 0; i < n.length; i++) n[i] = 0;
        var o = !0;
        for (i = 0; i < t; i++) {
            var s = r.evaluateAt(this.field.exp(i));
            n[n.length - 1 - i] = s, 0 != s && (o = !1)
        }
        if (!o) {
            var a = new GF256Poly(this.field, n),
                h = this.runEuclideanAlgorithm(this.field.buildMonomial(t, 1), a, t),
                c = h[0],
                d = h[1],
                l = this.findErrorLocations(c),
                w = this.findErrorMagnitudes(d, l, !1);
            for (i = 0; i < l.length; i++) {
                var f = e.length - 1 - this.field.log(l[i]);
                if (f < 0) throw "ReedSolomonException Bad error location";
                e[f] = GF256.addOrSubtract(e[f], w[i])
            }
        }
    }, this.runEuclideanAlgorithm = function (e, t, r) {
        if (e.Degree < t.Degree) {
            var n = e;
            e = t, t = n
        }
        for (var i = e, o = t, s = this.field.One, a = this.field.Zero, h = this.field.Zero, c = this.field.One; o.Degree >= Math.floor(r / 2);) {
            var d = i,
                l = s,
                w = h;
            if (s = a, h = c, (i = o).Zero) throw "r_{i-1} was zero";
            o = d;
            for (var f = this.field.Zero, u = i.getCoefficient(i.Degree), C = this.field.inverse(u); o.Degree >= i.Degree && !o.Zero;) {
                var E = o.Degree - i.Degree,
                    B = this.field.multiply(o.getCoefficient(o.Degree), C);
                f = f.addOrSubtract(this.field.buildMonomial(E, B)), o = o.addOrSubtract(i.multiplyByMonomial(E, B))
            }
            a = f.multiply1(s).addOrSubtract(l), c = f.multiply1(h).addOrSubtract(w)
        }
        var v = c.getCoefficient(0);
        if (0 == v) throw "ReedSolomonException sigmaTilde(0) was zero";
        var g = this.field.inverse(v),
            m = c.multiply2(g),
            k = o.multiply2(g);
        return new Array(m, k)
    }, this.findErrorLocations = function (e) {
        var t = e.Degree;
        if (1 == t) return new Array(e.getCoefficient(1));
        for (var r = new Array(t), n = 0, i = 1; i < 256 && n < t; i++) 0 == e.evaluateAt(i) && (r[n] = this.field.inverse(i), n++);
        if (n != t) throw "Error locator degree does not match number of roots";
        return r
    }, this.findErrorMagnitudes = function (e, t, r) {
        for (var n = t.length, i = new Array(n), o = 0; o < n; o++) {
            for (var s = this.field.inverse(t[o]), a = 1, h = 0; h < n; h++) o != h && (a = this.field.multiply(a, GF256.addOrSubtract(1, this.field.multiply(t[h], s))));
            i[o] = this.field.multiply(e.evaluateAt(s), this.field.inverse(a)), r && (i[o] = this.field.multiply(i[o], s))
        }
        return i
    }
}

function GF256Poly(e, t) {
    if (null == t || 0 == t.length) throw "System.ArgumentException";
    this.field = e;
    var r = t.length;
    if (r > 1 && 0 == t[0]) {
        for (var n = 1; n < r && 0 == t[n];) n++;
        if (n == r) this.coefficients = e.Zero.coefficients;
        else {
            this.coefficients = new Array(r - n);
            for (var i = 0; i < this.coefficients.length; i++) this.coefficients[i] = 0;
            for (var o = 0; o < this.coefficients.length; o++) this.coefficients[o] = t[n + o]
        }
    } else this.coefficients = t;
    this.__defineGetter__("Zero", function () {
        return 0 == this.coefficients[0]
    }), this.__defineGetter__("Degree", function () {
        return this.coefficients.length - 1
    }), this.__defineGetter__("Coefficients", function () {
        return this.coefficients
    }), this.getCoefficient = function (e) {
        return this.coefficients[this.coefficients.length - 1 - e]
    }, this.evaluateAt = function (e) {
        if (0 == e) return this.getCoefficient(0);
        var t = this.coefficients.length;
        if (1 == e) {
            for (var r = 0, n = 0; n < t; n++) r = GF256.addOrSubtract(r, this.coefficients[n]);
            return r
        }
        var i = this.coefficients[0];
        for (n = 1; n < t; n++) i = GF256.addOrSubtract(this.field.multiply(e, i), this.coefficients[n]);
        return i
    }, this.addOrSubtract = function (t) {
        if (this.field != t.field) throw "GF256Polys do not have same GF256 field";
        if (this.Zero) return t;
        if (t.Zero) return this;
        var r = this.coefficients,
            n = t.coefficients;
        if (r.length > n.length) {
            var i = r;
            r = n, n = i
        }
        for (var o = new Array(n.length), s = n.length - r.length, a = 0; a < s; a++) o[a] = n[a];
        for (var h = s; h < n.length; h++) o[h] = GF256.addOrSubtract(r[h - s], n[h]);
        return new GF256Poly(e, o)
    }, this.multiply1 = function (e) {
        if (this.field != e.field) throw "GF256Polys do not have same GF256 field";
        if (this.Zero || e.Zero) return this.field.Zero;
        for (var t = this.coefficients, r = t.length, n = e.coefficients, i = n.length, o = new Array(r + i - 1), s = 0; s < r; s++)
            for (var a = t[s], h = 0; h < i; h++) o[s + h] = GF256.addOrSubtract(o[s + h], this.field.multiply(a, n[h]));
        return new GF256Poly(this.field, o)
    }, this.multiply2 = function (e) {
        if (0 == e) return this.field.Zero;
        if (1 == e) return this;
        for (var t = this.coefficients.length, r = new Array(t), n = 0; n < t; n++) r[n] = this.field.multiply(this.coefficients[n], e);
        return new GF256Poly(this.field, r)
    }, this.multiplyByMonomial = function (e, t) {
        if (e < 0) throw "System.ArgumentException";
        if (0 == t) return this.field.Zero;
        for (var r = this.coefficients.length, n = new Array(r + e), i = 0; i < n.length; i++) n[i] = 0;
        for (i = 0; i < r; i++) n[i] = this.field.multiply(this.coefficients[i], t);
        return new GF256Poly(this.field, n)
    }, this.divide = function (e) {
        if (this.field != e.field) throw "GF256Polys do not have same GF256 field";
        if (e.Zero) throw "Divide by 0";
        for (var t = this.field.Zero, r = this, n = e.getCoefficient(e.Degree), i = this.field.inverse(n); r.Degree >= e.Degree && !r.Zero;) {
            var o = r.Degree - e.Degree,
                s = this.field.multiply(r.getCoefficient(r.Degree), i),
                a = e.multiplyByMonomial(o, s),
                h = this.field.buildMonomial(o, s);
            t = t.addOrSubtract(h), r = r.addOrSubtract(a)
        }
        return new Array(t, r)
    }
}

function GF256(e) {
    this.expTable = new Array(256), this.logTable = new Array(256);
    for (var t = 1, r = 0; r < 256; r++) this.expTable[r] = t, (t <<= 1) >= 256 && (t ^= e);
    for (r = 0; r < 255; r++) this.logTable[this.expTable[r]] = r;
    var n = new Array(1);
    n[0] = 0, this.zero = new GF256Poly(this, new Array(n));
    var i = new Array(1);
    i[0] = 1, this.one = new GF256Poly(this, new Array(i)), this.__defineGetter__("Zero", function () {
        return this.zero
    }), this.__defineGetter__("One", function () {
        return this.one
    }), this.buildMonomial = function (e, t) {
        if (e < 0) throw "System.ArgumentException";
        if (0 == t) return this.zero;
        for (var r = new Array(e + 1), n = 0; n < r.length; n++) r[n] = 0;
        return r[0] = t, new GF256Poly(this, r)
    }, this.exp = function (e) {
        return this.expTable[e]
    }, this.log = function (e) {
        if (0 == e) throw "System.ArgumentException";
        return this.logTable[e]
    }, this.inverse = function (e) {
        if (0 == e) throw "System.ArithmeticException";
        return this.expTable[255 - this.logTable[e]]
    }, this.multiply = function (e, t) {
        return 0 == e || 0 == t ? 0 : 1 == e ? t : 1 == t ? e : this.expTable[(this.logTable[e] + this.logTable[t]) % 255]
    }
}
DataMask.forReference = function (e) {
    if (e < 0 || e > 7) throw "System.ArgumentException";
    return DataMask.DATA_MASKS[e]
}, DataMask.DATA_MASKS = new Array(new DataMask000, new DataMask001, new DataMask010, new DataMask011, new DataMask100, new DataMask101, new DataMask110, new DataMask111), GF256.QR_CODE_FIELD = new GF256(285), GF256.DATA_MATRIX_FIELD = new GF256(301), GF256.addOrSubtract = function (e, t) {
    return e ^ t
};
var Decoder = {};
Decoder.rsDecoder = new ReedSolomonDecoder(GF256.QR_CODE_FIELD), Decoder.correctErrors = function (e, t) {
    for (var r = e.length, n = new Array(r), i = 0; i < r; i++) n[i] = 255 & e[i];
    var o = e.length - t;
    try {
        Decoder.rsDecoder.decode(n, o)
    } catch (e) {
        throw e
    }
    for (i = 0; i < t; i++) e[i] = n[i]
}, Decoder.decode = function (e) {
    for (var t = new BitMatrixParser(e), r = t.readVersion(), n = t.readFormatInformation().ErrorCorrectionLevel, i = t.readCodewords(), o = DataBlock.getDataBlocks(i, r, n), s = 0, a = 0; a < o.length; a++) s += o[a].NumDataCodewords;
    for (var h = new Array(s), c = 0, d = 0; d < o.length; d++) {
        var l = o[d],
            w = l.Codewords,
            f = l.NumDataCodewords;
        Decoder.correctErrors(w, f);
        for (a = 0; a < f; a++) h[c++] = w[a]
    }

    //document.write("H: ",h);
    return new QRCodeDataBlockReader(h, r.VersionNumber, n.Bits)
};
var qrcode = {};

function URShift(e, t) {
    return e >= 0 ? e >> t : (e >> t) + (2 << ~t)
}
qrcode.imagedata = null, qrcode.width = 0, qrcode.height = 0, qrcode.qrCodeSymbol = null, qrcode.debug = 1, qrcode.maxImgSize = 1048576, qrcode.sizeOfDataLengthInfo = [
    [10, 9, 8, 8],
    [12, 11, 16, 10],
    [14, 13, 16, 12]
], qrcode.callback = null, qrcode.vidSuccess = function (e) {
    qrcode.localstream = e, qrcode.webkit ? qrcode.video.src = window.webkitURL.createObjectURL(e) : qrcode.moz ? (qrcode.video.mozSrcObject = e, qrcode.video.play()) : qrcode.video.src = e, qrcode.gUM = !0, qrcode.canvas_qr2 = document.createElement("canvas"), qrcode.canvas_qr2.id = "qr-canvas", qrcode.qrcontext2 = qrcode.canvas_qr2.getContext("2d"), qrcode.canvas_qr2.width = qrcode.video.videoWidth, qrcode.canvas_qr2.height = qrcode.video.videoHeight, setTimeout(qrcode.captureToCanvas, 500)
}, qrcode.vidError = function (e) {
    qrcode.gUM = !1
}, qrcode.captureToCanvas = function () {
    if (qrcode.gUM) try {
        if (0 == qrcode.video.videoWidth) return void setTimeout(qrcode.captureToCanvas, 500);
        qrcode.canvas_qr2.width = qrcode.video.videoWidth, qrcode.canvas_qr2.height = qrcode.video.videoHeight, qrcode.qrcontext2.drawImage(qrcode.video, 0, 0);
        try {
            qrcode.decode()
        } catch (e) {
            console.log(e), setTimeout(qrcode.captureToCanvas, 500)
        }
    } catch (e) {
        console.log(e), setTimeout(qrcode.captureToCanvas, 500)
    }
}, qrcode.setWebcam = function (e) {
    var t = navigator;
    qrcode.video = document.getElementById(e);
    var r = !0;
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) try {
        navigator.mediaDevices.enumerateDevices().then(function (e) {
            e.forEach(function (e) {
                console.log("deb1"), "videoinput" === e.kind && e.label.toLowerCase().search("back") > -1 && (r = [{
                    sourceId: e.deviceId
                }]), console.log(e.kind + ": " + e.label + " id = " + e.deviceId)
            })
        })
    } catch (e) {
        console.log(e)
    } else console.log("no navigator.mediaDevices.enumerateDevices");
    t.getUserMedia ? t.getUserMedia({
        video: r,
        audio: !1
    }, qrcode.vidSuccess, qrcode.vidError) : t.webkitGetUserMedia ? (qrcode.webkit = !0, t.webkitGetUserMedia({
        video: r,
        audio: !1
    }, qrcode.vidSuccess, qrcode.vidError)) : t.mozGetUserMedia && (qrcode.moz = !0, t.mozGetUserMedia({
        video: r,
        audio: !1
    }, qrcode.vidSuccess, qrcode.vidError))
}, qrcode.decode = function (e) {

    if (0 == arguments.length) {
        if (qrcode.canvas_qr2) var t = qrcode.canvas_qr2,
            r = qrcode.qrcontext2;
        else {
            r = (t = document.getElementById("qr-canvas")).getContext("2d");
        }

        return qrcode.width = t.width, qrcode.height = t.height, qrcode.imagedata = r.getImageData(0, 0, qrcode.width, qrcode.height), qrcode.result = qrcode.process(r), null != qrcode.callback && qrcode.callback(qrcode.result), qrcode.result
    }
    var n = new Image;
    n.crossOrigin = "Anonymous", n.onload = function () {
        var e = document.getElementById("out-canvas");
        if (null != e) {
            var t = e.getContext("2d");
            t.clearRect(0, 0, 320, 240), t.drawImage(n, 0, 0, 320, 240)
        }
        var r = document.createElement("canvas"),
            i = r.getContext("2d"),
            o = n.height,
            s = n.width;
        if (n.width * n.height > qrcode.maxImgSize) {
            var a = n.width / n.height;
            s = a * (o = Math.sqrt(qrcode.maxImgSize / a))
        }

        r.width = s, r.height = o, i.drawImage(n, 0, 0, r.width, r.height), qrcode.width = r.width, qrcode.height = r.height;
        try {
            qrcode.imagedata = i.getImageData(0, 0, r.width, r.height)
        } catch (e) {
            return qrcode.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!", void (null != qrcode.callback && qrcode.callback(qrcode.result))
        }
        try {
            qrcode.result = qrcode.process(i)
        } catch (e) {
            console.log(e), qrcode.result = "error decoding QR Code"
        }
        null != qrcode.callback && qrcode.callback(qrcode.result)
    }, n.onerror = function () {
        null != qrcode.callback && qrcode.callback("Failed to load the image")
    }, n.src = e
}, qrcode.isUrl = function (e) {
    return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(e)
}, qrcode.decode_url = function (e) {
    var t = "";
    try {
        t = escape(e)
    } catch (r) {
        console.log(r), t = e
    }
    var r = "";
    try {
        r = decodeURIComponent(t)
    } catch (e) {
        console.log(e), r = t
    }
    return r
}, qrcode.decode_utf8 = function (e) {
    return qrcode.isUrl(e) ? qrcode.decode_url(e) : e
}, qrcode.process = function (e) {
    var t = (new Date).getTime(),
    r = qrcode.grayScaleToBitmap(qrcode.grayscale());
    if (qrcode.debug) {
        for (var n = 0; n < qrcode.height; n++)
        for (var i = 0; i < qrcode.width; i++) {
    var o = 4 * i + n * qrcode.width * 4;
    
    qrcode.imagedata.data[o] = (r[i + n * qrcode.width], 0), qrcode.imagedata.data[o + 1] = (r[i + n * qrcode.width], 0), qrcode.imagedata.data[o + 2] = r[i + n * qrcode.width] ? 255 : 0
    
            }
        e.putImageData(qrcode.imagedata, 0, 0)
    }
    try{
    var s = new Detector(r).detect();
    }
    catch(e){}
    // {console.log(e)}
    
    if (qrcode.debug) {
        for (n = 0; n < s.bits.Height; n++)
            for (i = 0; i < s.bits.Width; i++) {
                o = 4 * i * 2 + 2 * n * qrcode.width * 4;
                qrcode.imagedata.data[o] = (s.bits.get_Renamed(i, n), 0), qrcode.imagedata.data[o + 1] = (s.bits.get_Renamed(i, n), 0), qrcode.imagedata.data[o + 2] = s.bits.get_Renamed(i, n) ? 255 : 0
            }
        e.putImageData(qrcode.imagedata, 0, 0)
    }
    for (var a = Decoder.decode(s.bits).DataByte, h = "", c = 0; c < a.length; c++)
        for (var d = 0; d < a[c].length; d++) h += String.fromCharCode(a[c][d]);
    var l = (new Date).getTime() - t;
    return console.log(l), qrcode.decode_utf8(h)
}, qrcode.getPixel = function (e, t) {
    if (qrcode.width < e) throw "point error";
    if (qrcode.height < t) throw "point error";
    var r = 4 * e + t * qrcode.width * 4;
    return (33 * qrcode.imagedata.data[r] + 34 * qrcode.imagedata.data[r + 1] + 33 * qrcode.imagedata.data[r + 2]) / 100
}, qrcode.binarize = function (e) {
    for (var t = new Array(qrcode.width * qrcode.height), r = 0; r < qrcode.height; r++)
        for (var n = 0; n < qrcode.width; n++) {
            var i = qrcode.getPixel(n, r);
            t[n + r * qrcode.width] = i <= e
        }
    return t
}, qrcode.getMiddleBrightnessPerArea = function (e) {
    for (var t = Math.floor(qrcode.width / 4), r = Math.floor(qrcode.height / 4), n = new Array(4), i = 0; i < 4; i++) {
        n[i] = new Array(4);
        for (var o = 0; o < 4; o++) n[i][o] = new Array(0, 0)
    }
    for (var s = 0; s < 4; s++)
        for (var a = 0; a < 4; a++) {
            n[a][s][0] = 255;
            for (var h = 0; h < r; h++)
                for (var c = 0; c < t; c++) {
                    var d = e[t * a + c + (r * s + h) * qrcode.width];
                    d < n[a][s][0] && (n[a][s][0] = d), d > n[a][s][1] && (n[a][s][1] = d)
                }
        }
    for (var l = new Array(4), w = 0; w < 4; w++) l[w] = new Array(4);
    for (s = 0; s < 4; s++)
        for (a = 0; a < 4; a++) l[a][s] = Math.floor((n[a][s][0] + n[a][s][1]) / 2);
    return l
}, qrcode.grayScaleToBitmap = function (e) {
    for (var t = qrcode.getMiddleBrightnessPerArea(e), r = t.length, n = Math.floor(qrcode.width / r), i = Math.floor(qrcode.height / r), o = new ArrayBuffer(qrcode.width * qrcode.height), s = new Uint8Array(o), a = 0; a < r; a++)
        for (var h = 0; h < r; h++)
            for (var c = 0; c < i; c++)
                for (var d = 0; d < n; d++) s[n * h + d + (i * a + c) * qrcode.width] = e[n * h + d + (i * a + c) * qrcode.width] < t[h][a];
    return s
}, qrcode.grayscale = function () {
    for (var e = new ArrayBuffer(qrcode.width * qrcode.height), t = new Uint8Array(e), r = 0; r < qrcode.height; r++)
        for (var n = 0; n < qrcode.width; n++) {
            var i = qrcode.getPixel(n, r);
            t[n + r * qrcode.width] = i
        }
    return t
};
var MIN_SKIP = 3,
    MAX_MODULES = 57,
    INTEGER_MATH_SHIFT = 8,
    CENTER_QUORUM = 2;

function FinderPattern(e, t, r) {
    this.x = e, this.y = t, this.count = 1, this.estimatedModuleSize = r, this.__defineGetter__("EstimatedModuleSize", function () {
        return this.estimatedModuleSize
    }), this.__defineGetter__("Count", function () {
        return this.count
    }), this.__defineGetter__("X", function () {
        return this.x
    }), this.__defineGetter__("Y", function () {
        return this.y
    }), this.incrementCount = function () {
        this.count++
    }, this.aboutEquals = function (e, t, r) {
        if (Math.abs(t - this.y) <= e && Math.abs(r - this.x) <= e) {
            var n = Math.abs(e - this.estimatedModuleSize);
            return n <= 1 || n / this.estimatedModuleSize <= 1
        }
        return !1
    }
}

function FinderPatternInfo(e) {
    this.bottomLeft = e[0], this.topLeft = e[1], this.topRight = e[2], this.__defineGetter__("BottomLeft", function () {
        return this.bottomLeft
    }), this.__defineGetter__("TopLeft", function () {
        return this.topLeft
    }), this.__defineGetter__("TopRight", function () {
        return this.topRight
    })
}

function FinderPatternFinder() {
    this.image = null, this.possibleCenters = [], this.hasSkipped = !1, this.crossCheckStateCount = new Array(0, 0, 0, 0, 0), this.resultPointCallback = null, this.__defineGetter__("CrossCheckStateCount", function () {
        return this.crossCheckStateCount[0] = 0, this.crossCheckStateCount[1] = 0, this.crossCheckStateCount[2] = 0, this.crossCheckStateCount[3] = 0, this.crossCheckStateCount[4] = 0, this.crossCheckStateCount
    }), this.foundPatternCross = function (e) {
        for (var t = 0, r = 0; r < 5; r++) {
            var n = e[r];
            if (0 == n) return !1;
            t += n
        }
        if (t < 7) return !1;
        var i = Math.floor((t << INTEGER_MATH_SHIFT) / 7),
            o = Math.floor(i / 2);
        return Math.abs(i - (e[0] << INTEGER_MATH_SHIFT)) < o && Math.abs(i - (e[1] << INTEGER_MATH_SHIFT)) < o && Math.abs(3 * i - (e[2] << INTEGER_MATH_SHIFT)) < 3 * o && Math.abs(i - (e[3] << INTEGER_MATH_SHIFT)) < o && Math.abs(i - (e[4] << INTEGER_MATH_SHIFT)) < o
    }, this.centerFromEnd = function (e, t) {
        return t - e[4] - e[3] - e[2] / 2
    }, this.crossCheckVertical = function (e, t, r, n) {
        for (var i = this.image, o = qrcode.height, s = this.CrossCheckStateCount, a = e; a >= 0 && i[t + a * qrcode.width];) s[2]++, a--;
        if (a < 0) return NaN;
        for (; a >= 0 && !i[t + a * qrcode.width] && s[1] <= r;) s[1]++, a--;
        if (a < 0 || s[1] > r) return NaN;
        for (; a >= 0 && i[t + a * qrcode.width] && s[0] <= r;) s[0]++, a--;
        if (s[0] > r) return NaN;
        for (a = e + 1; a < o && i[t + a * qrcode.width];) s[2]++, a++;
        if (a == o) return NaN;
        for (; a < o && !i[t + a * qrcode.width] && s[3] < r;) s[3]++, a++;
        if (a == o || s[3] >= r) return NaN;
        for (; a < o && i[t + a * qrcode.width] && s[4] < r;) s[4]++, a++;
        if (s[4] >= r) return NaN;
        var h = s[0] + s[1] + s[2] + s[3] + s[4];
        return 5 * Math.abs(h - n) >= 2 * n ? NaN : this.foundPatternCross(s) ? this.centerFromEnd(s, a) : NaN
    }, this.crossCheckHorizontal = function (e, t, r, n) {
        for (var i = this.image, o = qrcode.width, s = this.CrossCheckStateCount, a = e; a >= 0 && i[a + t * qrcode.width];) s[2]++, a--;
        if (a < 0) return NaN;
        for (; a >= 0 && !i[a + t * qrcode.width] && s[1] <= r;) s[1]++, a--;
        if (a < 0 || s[1] > r) return NaN;
        for (; a >= 0 && i[a + t * qrcode.width] && s[0] <= r;) s[0]++, a--;
        if (s[0] > r) return NaN;
        for (a = e + 1; a < o && i[a + t * qrcode.width];) s[2]++, a++;
        if (a == o) return NaN;
        for (; a < o && !i[a + t * qrcode.width] && s[3] < r;) s[3]++, a++;
        if (a == o || s[3] >= r) return NaN;
        for (; a < o && i[a + t * qrcode.width] && s[4] < r;) s[4]++, a++;
        if (s[4] >= r) return NaN;
        var h = s[0] + s[1] + s[2] + s[3] + s[4];
        return 5 * Math.abs(h - n) >= n ? NaN : this.foundPatternCross(s) ? this.centerFromEnd(s, a) : NaN
    }, this.handlePossibleCenter = function (e, t, r) {
        var n = e[0] + e[1] + e[2] + e[3] + e[4],
            i = this.centerFromEnd(e, r),
            o = this.crossCheckVertical(t, Math.floor(i), e[2], n);
        if (!isNaN(o) && (i = this.crossCheckHorizontal(Math.floor(i), Math.floor(o), e[2], n), !isNaN(i))) {
            for (var s = n / 7, a = !1, h = this.possibleCenters.length, c = 0; c < h; c++) {
                var d = this.possibleCenters[c];
                if (d.aboutEquals(s, o, i)) {
                    d.incrementCount(), a = !0;
                    break
                }
            }
            if (!a) {
                var l = new FinderPattern(i, o, s);
                this.possibleCenters.push(l), null != this.resultPointCallback && this.resultPointCallback.foundPossibleResultPoint(l)
            }
            return !0
        }
        return !1
    }, this.selectBestPatterns = function () {
        var e = this.possibleCenters.length;
        if (e < 3) {
            throw "Couldn't find enough finder patterns (found " + e + ")";

        }
        if (e > 3) {
            for (var t = 0, r = 0, n = 0; n < e; n++) {
                var i = this.possibleCenters[n].EstimatedModuleSize;
                t += i, r += i * i
            }
            var o = t / e;
            this.possibleCenters.sort(function (e, t) {
                var r = Math.abs(t.EstimatedModuleSize - o),
                    n = Math.abs(e.EstimatedModuleSize - o);
                return r < n ? -1 : r == n ? 0 : 1
            });
            var s = Math.sqrt(r / e - o * o),
                a = Math.max(.2 * o, s);
            for (n = this.possibleCenters.length - 1; n >= 0; n--) {
                var h = this.possibleCenters[n];
                Math.abs(h.EstimatedModuleSize - o) > a && this.possibleCenters.splice(n, 1)
            }
        }
        return this.possibleCenters.length > 3 && this.possibleCenters.sort(function (e, t) {
            return e.count > t.count ? -1 : e.count < t.count ? 1 : 0
        }), new Array(this.possibleCenters[0], this.possibleCenters[1], this.possibleCenters[2])
    }, this.findRowSkip = function () {
        var e = this.possibleCenters.length;
        if (e <= 1) return 0;
        for (var t = null, r = 0; r < e; r++) {
            var n = this.possibleCenters[r];
            if (n.Count >= CENTER_QUORUM) {
                if (null != t) return this.hasSkipped = !0, Math.floor((Math.abs(t.X - n.X) - Math.abs(t.Y - n.Y)) / 2);
                t = n
            }
        }
        return 0
    }, this.haveMultiplyConfirmedCenters = function () {
        for (var e = 0, t = 0, r = this.possibleCenters.length, n = 0; n < r; n++) {
            var i = this.possibleCenters[n];
            i.Count >= CENTER_QUORUM && (e++, t += i.EstimatedModuleSize)
        }
        if (e < 3) return !1;
        var o = t / r,
            s = 0;
        for (n = 0; n < r; n++) i = this.possibleCenters[n], s += Math.abs(i.EstimatedModuleSize - o);
        return s <= .05 * t
    }, this.findFinderPattern = function (e) {

        this.image = e;

        var t = qrcode.height,
            r = qrcode.width,
            n = Math.floor(3 * t / (4 * MAX_MODULES));
        n < MIN_SKIP && (n = MIN_SKIP);
        for (var i = !1, o = new Array(5), s = n - 1; s < t && !i; s += n) {
            o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0;
            for (var a = 0, h = 0; h < r; h++)
                if (e[h + s * qrcode.width]) 1 == (1 & a) && a++, o[a]++;
                else if (0 == (1 & a))
                    if (4 == a)
                        if (this.foundPatternCross(o)) {
                            if (this.handlePossibleCenter(o, s, h))
                                if (n = 2, this.hasSkipped) i = this.haveMultiplyConfirmedCenters();
                                else {
                                    var c = this.findRowSkip();
                                    c > o[2] && (s += c - o[2] - n, h = r - 1)
                                }
                            else {
                                do {
                                    h++
                                } while (h < r && !e[h + s * qrcode.width]);
                                h--
                            }
                            a = 0, o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0
                        } else o[0] = o[2], o[1] = o[3], o[2] = o[4], o[3] = 1, o[4] = 0, a = 3;
                    else o[++a]++;
                else o[a]++;
            if (this.foundPatternCross(o)) this.handlePossibleCenter(o, s, r) && (n = o[0], this.hasSkipped && (i = this.haveMultiplyConfirmedCenters()))
        }
        var d = this.selectBestPatterns();

        return qrcode.orderBestPatterns(d), new FinderPatternInfo(d)
    }
}

function AlignmentPattern(e, t, r) {
    this.x = e, this.y = t, this.count = 1, this.estimatedModuleSize = r, this.__defineGetter__("EstimatedModuleSize", function () {
        return this.estimatedModuleSize
    }), this.__defineGetter__("Count", function () {
        return this.count
    }), this.__defineGetter__("X", function () {
        return Math.floor(this.x)
    }), this.__defineGetter__("Y", function () {
        return Math.floor(this.y)
    }), this.incrementCount = function () {
        this.count++
    }, this.aboutEquals = function (e, t, r) {
        if (Math.abs(t - this.y) <= e && Math.abs(r - this.x) <= e) {
            var n = Math.abs(e - this.estimatedModuleSize);
            return n <= 1 || n / this.estimatedModuleSize <= 1
        }
        return !1
    }
}

function AlignmentPatternFinder(e, t, r, n, i, o, s) {
    this.image = e, this.possibleCenters = new Array, this.startX = t, this.startY = r, this.width = n, this.height = i, this.moduleSize = o, this.crossCheckStateCount = new Array(0, 0, 0), this.resultPointCallback = s, this.centerFromEnd = function (e, t) {
        return t - e[2] - e[1] / 2
    }, this.foundPatternCross = function (e) {
        for (var t = this.moduleSize, r = t / 2, n = 0; n < 3; n++)
            if (Math.abs(t - e[n]) >= r) return !1;
        return !0
    }, this.crossCheckVertical = function (e, t, r, n) {
        var i = this.image,
            o = qrcode.height,
            s = this.crossCheckStateCount;
        s[0] = 0, s[1] = 0, s[2] = 0;
        for (var a = e; a >= 0 && i[t + a * qrcode.width] && s[1] <= r;) s[1]++, a--;
        if (a < 0 || s[1] > r) return NaN;
        for (; a >= 0 && !i[t + a * qrcode.width] && s[0] <= r;) s[0]++, a--;
        if (s[0] > r) return NaN;
        for (a = e + 1; a < o && i[t + a * qrcode.width] && s[1] <= r;) s[1]++, a++;
        if (a == o || s[1] > r) return NaN;
        for (; a < o && !i[t + a * qrcode.width] && s[2] <= r;) s[2]++, a++;
        if (s[2] > r) return NaN;
        var h = s[0] + s[1] + s[2];
        return 5 * Math.abs(h - n) >= 2 * n ? NaN : this.foundPatternCross(s) ? this.centerFromEnd(s, a) : NaN
    }, this.handlePossibleCenter = function (e, t, r) {
        var n = e[0] + e[1] + e[2],
            i = this.centerFromEnd(e, r),
            o = this.crossCheckVertical(t, Math.floor(i), 2 * e[1], n);
        if (!isNaN(o)) {
            for (var s = (e[0] + e[1] + e[2]) / 3, a = this.possibleCenters.length, h = 0; h < a; h++) {
                if (this.possibleCenters[h].aboutEquals(s, o, i)) return new AlignmentPattern(i, o, s)
            }
            var c = new AlignmentPattern(i, o, s);
            this.possibleCenters.push(c), null != this.resultPointCallback && this.resultPointCallback.foundPossibleResultPoint(c)
        }
        return null
    }, this.find = function () {
        for (var t = this.startX, i = this.height, o = t + n, s = r + (i >> 1), a = new Array(0, 0, 0), h = 0; h < i; h++) {
            var c = s + (0 == (1 & h) ? h + 1 >> 1 : -(h + 1 >> 1));
            a[0] = 0, a[1] = 0, a[2] = 0;
            for (var d = t; d < o && !e[d + qrcode.width * c];) d++;
            for (var l = 0; d < o;) {
                if (e[d + c * qrcode.width])
                    if (1 == l) a[l]++;
                    else if (2 == l) {
                        var w;
                        if (this.foundPatternCross(a))
                            if (null != (w = this.handlePossibleCenter(a, c, d))) return w;
                        a[0] = a[2], a[1] = 1, a[2] = 0, l = 1
                    } else a[++l]++;
                else 1 == l && l++, a[l]++;
                d++
            }
            if (this.foundPatternCross(a))
                if (null != (w = this.handlePossibleCenter(a, c, o))) return w
        }
        if (0 != this.possibleCenters.length) return this.possibleCenters[0];
        throw "Couldn't find enough alignment patterns"
    }
}

function QRCodeDataBlockReader(e, t, r) {
    //document.write("<br>E: ",e);
    //document.write("<br>T: ",t);
    //document.write("<br>R: ",r);
    this.blockPointer = 0, this.bitPointer = 7, this.dataLength = 0, this.blocks = e, this.numErrorCorrectionCode = r, t <= 9 ? this.dataLengthMode = 0 : t >= 10 && t <= 26 ? this.dataLengthMode = 1 : t >= 27 && t <= 40 && (this.dataLengthMode = 2), this.getNextBits = function (e) {
        var t = 0;
        if (e < this.bitPointer + 1) {
            for (var r = 0, n = 0; n < e; n++) r += 1 << n;
            return r <<= this.bitPointer - e + 1, t = (this.blocks[this.blockPointer] & r) >> this.bitPointer - e + 1, this.bitPointer -= e, t
        }
        if (e < this.bitPointer + 1 + 8) {
            var i = 0;
            for (n = 0; n < this.bitPointer + 1; n++) i += 1 << n;
            return t = (this.blocks[this.blockPointer] & i) << e - (this.bitPointer + 1), this.blockPointer++, t += this.blocks[this.blockPointer] >> 8 - (e - (this.bitPointer + 1)), this.bitPointer = this.bitPointer - e % 8, this.bitPointer < 0 && (this.bitPointer = 8 + this.bitPointer), t
        }
        if (e < this.bitPointer + 1 + 16) {
            i = 0;
            var o = 0;
            for (n = 0; n < this.bitPointer + 1; n++) i += 1 << n;
            var s = (this.blocks[this.blockPointer] & i) << e - (this.bitPointer + 1);
            this.blockPointer++;
            var a = this.blocks[this.blockPointer] << e - (this.bitPointer + 1 + 8);
            this.blockPointer++;
            for (n = 0; n < e - (this.bitPointer + 1 + 8); n++) o += 1 << n;
            return o <<= 8 - (e - (this.bitPointer + 1 + 8)), t = s + a + ((this.blocks[this.blockPointer] & o) >> 8 - (e - (this.bitPointer + 1 + 8))), this.bitPointer = this.bitPointer - (e - 8) % 8, this.bitPointer < 0 && (this.bitPointer = 8 + this.bitPointer), t
        }
        return 0
    }, this.NextMode = function () {
        return this.blockPointer > this.blocks.length - this.numErrorCorrectionCode - 2 ? 0 : this.getNextBits(4)
    }, this.getDataLength = function (e) {
        for (var t = 0; e >> t != 1;) t++;
        return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][t])
    }, this.getRomanAndFigureString = function (e) {
        var t = e,
            r = 0,
            n = "",
            i = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":");
        do {
            if (t > 1) {
                var o = (r = this.getNextBits(11)) % 45;
                n += i[Math.floor(r / 45)], n += i[o], t -= 2
            } else 1 == t && (n += i[r = this.getNextBits(6)], t -= 1)
        } while (t > 0);
        return n
    }, this.getFigureString = function (e) {
        var t = e,
            r = 0,
            n = "";
        do {
            t >= 3 ? ((r = this.getNextBits(10)) < 100 && (n += "0"), r < 10 && (n += "0"), t -= 3) : 2 == t ? ((r = this.getNextBits(7)) < 10 && (n += "0"), t -= 2) : 1 == t && (r = this.getNextBits(4), t -= 1), n += r
        } while (t > 0);
        return n
    }, this.get8bitByteArray = function (e) {
        var t = e,
            r = 0,
            n = new Array;
        do {
            r = this.getNextBits(8), n.push(r), t--
        } while (t > 0);
        return n
    }, this.getKanjiString = function (e) {
        var t = e,
            r = 0,
            n = "";
        do {
            var i = ((r = this.getNextBits(13)) / 192 << 8) + r % 192,
                o = 0;
            o = i + 33088 <= 40956 ? i + 33088 : i + 49472, n += String.fromCharCode(o), t--
        } while (t > 0);
        return n
    }, this.parseECIValue = function () {
        var e = 0,
            t = this.getNextBits(8);
        (0 == (128 & t) && (e = 127 & t), 128 == (192 & t)) && (e = (63 & t) << 8 | this.getNextBits(8));
        192 == (224 & t) && (e = (31 & t) << 16 | this.getNextBits(8));
        return e
    }, this.__defineGetter__("DataByte", function () {
        for (var e = new Array; ;) {
            var t = this.NextMode();
            if (0 == t) {
                if (e.length > 0) break;
                throw "Empty data block"
            }
            if (1 != t && 2 != t && 4 != t && 8 != t && 7 != t) throw "Invalid mode: " + t + " in (block:" + this.blockPointer + " bit:" + this.bitPointer + ")";
            if (7 == t) var r = this.parseECIValue();
            else {
                var n = this.getDataLength(t);
                if (n < 1) throw "Invalid data length: " + n;
                switch (t) {
                    case 1:
                        for (var i = this.getFigureString(n), o = new Array(i.length), s = 0; s < i.length; s++) o[s] = i.charCodeAt(s);
                        e.push(o);
                        break;
                    case 2:
                        for (i = this.getRomanAndFigureString(n), o = new Array(i.length), s = 0; s < i.length; s++) o[s] = i.charCodeAt(s);
                        e.push(o);
                        break;
                    case 4:
                        r = this.get8bitByteArray(n);
                        e.push(r);
                        break;
                    case 8:
                        i = this.getKanjiString(n);
                        e.push(i)
                }
            }
        }
        return e
    })
}
qrcode.orderBestPatterns = function (e) {
    function t(e, t) {
        var r = e.X - t.X,
            n = e.Y - t.Y;
        return Math.sqrt(r * r + n * n)
    }
    var r, n, i, o = t(e[0], e[1]),
        s = t(e[1], e[2]),
        a = t(e[0], e[2]);
    if (s >= o && s >= a ? (n = e[0], r = e[1], i = e[2]) : a >= s && a >= o ? (n = e[1], r = e[0], i = e[2]) : (n = e[2], r = e[0], i = e[1]), function (e, t, r) {
        var n = t.x,
            i = t.y;
        return (r.x - n) * (e.y - i) - (r.y - i) * (e.x - n)
    }(r, n, i) < 0) {
        var h = r;
        r = i, i = h
    }
    e[0] = r, e[1] = n, e[2] = i
};

/** Html5Qrcode From here */
"use strict";

function _classCallCheck(a, b) {
    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function")
}

function _defineProperties(a, b) {
    for (var c, d = 0; d < b.length; d++) c = b[d], c.enumerable = c.enumerable || !1, c.configurable = !0, "value" in c && (c.writable = !0), Object.defineProperty(a, c.key, c)
}

function _createClass(a, b, c) {
    return b && _defineProperties(a.prototype, b), c && _defineProperties(a, c), a
}

function _defineProperty(a, b, c) {
    return b in a ? Object.defineProperty(a, b, {
        value: c,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : a[b] = c, a
}
var Html5Qrcode = function () {
    function a(b, c) {
        if (_classCallCheck(this, a), !qrcode) throw "qrcode is not defined, use the minified/html5-qrcode.min.js for proper support";
        this._elementId = b, this._foreverScanTimeout = null, this._localMediaStream = null, this._shouldScan = !0, this._url = window.URL || window.webkitURL || window.mozURL || window.msURL, this._userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia, this._isScanning = !1, a.VERBOSE = !0 === c
    }
    return _createClass(a, [{
        key: "start",
        value: function (b, c, d, e) {
            var f = this;
            if (!b) throw "cameraId is required";
            if (!d || "function" != typeof d) throw "qrCodeSuccessCallback is required and should be a function.";
            e || (e = console.log), this._clearElement();
            var g = this,
                h = c ? c : {};
            h.fps = h.fps ? h.fps : a.SCAN_DEFAULT_FPS;
            var i = null != h.qrbox,
                j = document.getElementById(this._elementId),
                k = j.clientWidth ? j.clientWidth : a.DEFAULT_WIDTH;
            if (j.style.position = "relative", this._shouldScan = !0, this._element = j, qrcode.callback = d, i) {
                var l = h.qrbox;
                if (l < a.MIN_QR_BOX_SIZE) throw "minimum size of 'config.qrbox' is" + " ".concat(a.MIN_QR_BOX_SIZE, "px.");
                if (l > k) throw "'config.qrbox' should not be greater than the width of the HTML element."
            }
            var m = function (a, b) {
                var c = h.qrbox;
                c > b && console.warn("[Html5Qrcode] config.qrboxsize is greater than video height. Shading will be ignored");
                var d = i && c <= b,
                    e = d ? f._getShadedRegionBounds(a, b, c) : {
                        x: 0,
                        y: 0,
                        width: a,
                        height: b
                    },
                    k = f._createCanvasElement(e.width, e.height),
                    l = k.getContext("2d");
                    inv_canvas=document.createElement("canvas");
                    inv_context=inv_canvas.getContext("2d");
                    inv_canvas.style.display = "none"
                    imageinv=document.getElementById("inversereader").appendChild(inv_canvas)

                l.canvas.width = e.width, l.canvas.height = e.height, j.append(k), d && f._possiblyInsertShadingElement(j, b, e), g._qrRegion = e, g._context = l,g._invercontext=inv_context, g._canvasElement = k
            },
            p = function () {
                try {
                    
                    return qrcode.decode(), f._possiblyUpdateShaders(!0)
                } catch (a) {
                    f._possiblyUpdateShaders(!1), e("QR code parse error, error = ".concat(a))
                }
            },
                n = function b() {
                    if (g._shouldScan) {
                        if (g._localMediaStream) {
                            var c = g._videoElement,
                                d = c.videoWidth / c.clientWidth,
                                i = c.videoHeight / c.clientHeight,
                                j = g._qrRegion.width * d,
                                k = g._qrRegion.height * i;
                                g._context.drawImage(g._videoElement, g._qrRegion.x, g._qrRegion.y, j, k, 0, 0, g._qrRegion.width, g._qrRegion.height),p();
                            //Inversion logic
                            
                                g._invercontext.drawImage(g._videoElement, g._qrRegion.x, g._qrRegion.y, j, k, 0, 0, g._qrRegion.width, g._qrRegion.height),p();
                                var imageData=g._invercontext.getImageData(0, 0, g._qrRegion.width, g._qrRegion.height);
                                for (var i = 0; i < imageData.data.length; i += 4) {
                                    var grayscale = imageData.data[i];
                                    var invertedValue = 255 - grayscale;
                                    imageData.data[i] = invertedValue;  
                                    imageData.data[i + 1] = invertedValue;
                                    imageData.data[i + 2] = invertedValue;     
                                }
                                g._context.putImageData(imageData, 0, 0),p() || !0 === h.disableFlip || (f._context.translate(f._context.canvas.width, 0), f._context.scale(-1, 1), p())
                            
                          
                        }
                        g._foreverScanTimeout = setTimeout(b, a._getTimeoutFps(h.fps))
                    }
                },
                o = function (a) {
                    return new Promise(function (b, c) {
                        g._localMediaStream = a,
                            function () {
                                var d = f._createVideoElement(k);
                                g._element.append(d), d.onabort = c, d.onerror = c, d.onplaying = function () {
                                    var a = d.clientWidth,
                                        c = d.clientHeight;
                                    m(a, c), n(), b()
					 // 🔹 Adjust Zoom Dynamically
                let track = a.getVideoTracks()[0];
                let capabilities = track.getCapabilities();
					console.log("capabilities: ",capabilities);
                if (capabilities.zoom) {
                    let zoomLevel = capabilities.zoom.max || 6;  // Default max zoom
                    track.applyConstraints({
                        advanced: [{ zoom: zoomLevel }]
                    }).catch(err => console.warn("Zoom adjustment error:", err));
                }
            };
            
                                }, d.srcObject = a, d.play(), g._videoElement = d
                            }()
                    })
                };
            return new Promise(function (a, c) {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({
                        audio: !1,
                        video: {
                            deviceId: {
                                exact: b
                            },
				            focusMode:"continuous", // Enable continuous autofocus
                            zoom: 6,
                            aspectRatio:1.777777778
                        }
                    }).then(function (b) {
                        o(b).then(function () {
                            g._isScanning = !0, a()
                        })["catch"](c)
                    })["catch"](function (a) {
                        c("Error getting userMedia, error = ".concat(a))
                    })
                } else if (navigator.getUserMedia) {
                    navigator.getUserMedia({
                        video: {
                            optional: [{
                                sourceId: b
                            }],focusMode:"continuous", // Enable continuous autofocus
                            zoom: 6,
                            aspectRatio:1.777777778
                        }
                    }, function (b) {
                        o(b).then(function () {
                            g._isScanning = !0, a()
                        })["catch"](c)
                    }, function (a) {
                        c("Error getting userMedia, error = ".concat(a))
                    })
                } else c("Web camera streaming not supported by the browser.")
            })
        }
    }, {
        key: "stop",
        value: function () {
            this._shouldScan = !1, clearTimeout(this._foreverScanTimeout);
            var b = this;
            return new Promise(function (c) {
                qrcode.callback = null;
                var d = b._localMediaStream.getVideoTracks().length,
                    e = 0,
                    f = function () {
                        for (; b._element.getElementsByClassName(a.SHADED_REGION_CLASSNAME).length;) {
                            var c = b._element.getElementsByClassName(a.SHADED_REGION_CLASSNAME)[0];
                            b._element.removeChild(c)
                        }
                    },
                    g = function () {
                        b._localMediaStream = null, b._element.removeChild(b._videoElement), b._element.removeChild(b._canvasElement), f(), b._isScanning = !1, b._qrRegion && (b._qrRegion = null), b._context && (b._context = null), c(!0)
                    };
                b._localMediaStream.getVideoTracks().forEach(function (a) {
                    a.stop(), ++e, e >= d && g()
                })
            })
        }
    }, {
        key: "scanFile",
        value: function (b, c) {
            var d = this;
            if (!b || !(b instanceof File)) throw "imageFile argument is mandatory and should be instance of File. Use 'event.target.files[0]'";
            if (c = void 0 === c || c, d._isScanning) throw "Close ongoing scan before scanning a file.";
            var e = function b(c, d, e, f) {
                if (c <= e && d <= f) {
                    var g = (e - c) / 2,
                        h = (f - d) / 2;
                    return {
                        x: g,
                        y: h,
                        width: c,
                        height: d
                    }
                }
                var i = c,
                    j = d;
                return c > e && (d = e / c * d, c = e), d > f && (c = f / d * c, d = f), a._log("Image downsampled from " + "".concat(i, "X").concat(j) + " to ".concat(c, "X").concat(d, ".")), b(c, d, e, f)
            };
            return new Promise(function (f, g) {
                d._possiblyCloseLastScanImageFile(), d._clearElement(), d._lastScanImageFile = b;
                var h = new Image;
                h.onload = function () {
                    var b = Math.max,
                        i = h.width,
                        j = h.height,
                        k = document.getElementById(d._elementId),
                        l = k.clientWidth ? k.clientWidth : a.DEFAULT_WIDTH,
                        m = b(k.clientHeight ? k.clientHeight : j, a.FILE_SCAN_MIN_HEIGHT),
                        n = e(i, j, l, m);
                    if (c) {
                        var o = d._createCanvasElement(l, m, "qr-canvas-visible");
                        o.style.display = "inline-block", k.appendChild(o);
                        var p = o.getContext("2d");
                        p.canvas.width = l, p.canvas.height = m, p.drawImage(h, 0, 0, i, j, n.x, n.y, n.width, n.height)
                    }
                    var q = d._createCanvasElement(n.width, n.height);
                    k.appendChild(q);
                    var r = q.getContext("2d");
                    r.canvas.width = n.width, r.canvas.height = n.height, r.drawImage(h, 0, 0, i, j, 0, 0, n.width, n.height);
                    try {
                        f(qrcode.decode())
                    } catch (a) {
                        g("QR code parse error, error = ".concat(a))
                    }
                }, h.onerror = g, h.onabort = g, h.onstalled = g, h.onsuspend = g, h.src = URL.createObjectURL(b)
            })
        }
    }, {
        key: "clear",
        value: function () {
            this._clearElement()
        }
    }, {
        key: "_clearElement",
        value: function () {
            if (this._isScanning) throw "Cannot clear while scan is ongoing, close it first.";
            var a = document.getElementById(this._elementId);
            a.innerHTML = ""
        }
    }, {
        key: "_createCanvasElement",
        value: function (a, b, c) {
            var d = document.createElement("canvas");
            return d.style.width = "".concat(a, "px"), d.style.height = "".concat(b, "px"), d.style.display = "none", d.id = null == c ? "qr-canvas" : c, d
        }
    }, {
        key: "_createVideoElement",
        value: function (a) {
            var b = document.createElement("video");
            return b.style.width = "".concat(a, "px"), b.muted = !0, b.playsInline = !0, b
        }
    }, {
        key: "_getShadedRegionBounds",
        value: function (a, b, c) {
            if (c > a || c > b) throw "'config.qrbox' should not be greater than the width and height of the HTML element.";
            return {
                x: (a - c) / 2,
                y: (b - c) / 2,
                width: c,
                height: c
            }
        }
    }, {
        key: "_possiblyInsertShadingElement",
        value: function (b, c, d) {
            var e = this;
            if (0 != d.x || 0 != d.y) {
                var f = {};
                f[a.SHADED_LEFT] = this._createShadedElement(c, d, a.SHADED_LEFT), f[a.SHADED_RIGHT] = this._createShadedElement(c, d, a.SHADED_RIGHT), f[a.SHADED_TOP] = this._createShadedElement(c, d, a.SHADED_TOP), f[a.SHADED_BOTTOM] = this._createShadedElement(c, d, a.SHADED_BOTTOM), Object.keys(f).forEach(function (a) {
                    return b.append(f[a])
                }), 10 > d.x || 10 > d.y ? this.hasBorderShaders = !1 : (Object.keys(f).forEach(function (a) {
                    return e._insertShaderBorders(f[a], d, a)
                }), this.hasBorderShaders = !0)
            }
        }
    }, {
        key: "_createShadedElement",
        value: function (b, c, d) {
            var e = document.createElement("div");
            switch (e.style.position = "absolute", e.style.height = "".concat(b, "px"), e.className = a.SHADED_REGION_CLASSNAME, e.id = "".concat(a.SHADED_REGION_CLASSNAME, "_").concat(d), e.style.background = "#0000007a", d) {
                case a.SHADED_LEFT:
                    e.style.top = "0px", e.style.left = "0px", e.style.width = "".concat(c.x, "px"), e.style.height = "".concat(b, "px");
                    break;
                case a.SHADED_RIGHT:
                    e.style.top = "0px", e.style.right = "0px", e.style.width = "".concat(c.x, "px"), e.style.height = "".concat(b, "px");
                    break;
                case a.SHADED_TOP:
                    e.style.top = "0px", e.style.left = "".concat(c.x, "px"), e.style.width = "".concat(c.width, "px"), e.style.height = "".concat(c.y, "px");
                    break;
                case a.SHADED_BOTTOM:
                    var f = c.y + c.height;
                    e.style.top = "".concat(f, "px"), e.style.left = "".concat(c.x, "px"), e.style.width = "".concat(c.width, "px"), e.style.height = "".concat(c.y, "px");
                    break;
                default:
                    throw "Unsupported shadingPosition";
            }
            return e
        }
    }, {
        key: "_insertShaderBorders",
        value: function (b, c, d) {
            d = parseInt(d);
            var e = this,
                f = 5,
                g = 5,
                h = 40,
                i = function () {
                    var b = document.createElement("div");
                    switch (b.style.position = "absolute", b.style.backgroundColor = a.BORDER_SHADER_DEFAULT_COLOR, d) {
                        case a.SHADED_LEFT:
                        case a.SHADED_RIGHT:
                            b.style.width = "".concat(g, "px"), b.style.height = "".concat(h + f, "px");
                            break;
                        case a.SHADED_TOP:
                        case a.SHADED_BOTTOM:
                            b.style.width = "".concat(h + f, "px"), b.style.height = "".concat(g, "px");
                            break;
                        default:
                            throw "Unsupported shadingPosition";
                    }
                    return b
                },
                j = function (a, c) {
                    if (null === a || null === c) throw "Shaders should have defined positions";
                    var d = i();
                    d.style.top = "".concat(a, "px"), d.style.left = "".concat(c, "px"), b.appendChild(d), e.borderShaders || (e.borderShaders = []), e.borderShaders.push(d)
                },
                k = null,
                l = null,
                m = null,
                n = null;
            switch (d) {
                case a.SHADED_LEFT:
                    k = c.y - f, l = c.x - g, m = c.y + c.height - h, n = l;
                    break;
                case a.SHADED_RIGHT:
                    k = c.y - f, l = 0, m = c.y + c.height - h, n = l;
                    break;
                case a.SHADED_TOP:
                    k = c.y - f, l = -g, m = k, n = c.width - h;
                    break;
                case a.SHADED_BOTTOM:
                    k = 0, l = -g, m = k, n = c.width - h;
                    break;
                default:
                    throw "Unsupported shadingPosition";
            }
            j(k, l), j(m, n)
        }
    }, {
        key: "_possiblyUpdateShaders",
        value: function (b) {
            this.qrMatch === b || (this.hasBorderShaders && this.borderShaders && this.borderShaders.length && this.borderShaders.forEach(function (c) {
                c.style.backgroundColor = b ? a.BORDER_SHADER_MATCH_COLOR : a.BORDER_SHADER_DEFAULT_COLOR
            }), this.qrMatch = b)
        }
    }, {
        key: "_possiblyCloseLastScanImageFile",
        value: function () {
            this._lastScanImageFile && (URL.revokeObjectURL(this._lastScanImageFile), this._lastScanImageFile = null)
        }
    }], [{
        key: "getCameras",
        value: function () {
            var a = this;
            return new Promise(function (b, c) {
                if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && navigator.mediaDevices.getUserMedia) a._log("navigator.mediaDevices used"), navigator.mediaDevices.getUserMedia({
                    audio: !1,
                    video: !0
                }).then(function (d) {
                    d.oninactive = function () {
                        return a._log("All streams closed")
                    };
                    var e = function (a) {
                        for (var b, c = a.getVideoTracks(), d = 0; d < c.length; d++) b = c[d], b.enabled = !1, b.stop(), a.removeTrack(b)
                    };
                    navigator.mediaDevices.enumerateDevices().then(function (c) {
                        for (var f, g = [], h = 0; h < c.length; h++) f = c[h], "videoinput" == f.kind && g.push({
                            id: f.deviceId,
                            label: f.label
                        });
                        a._log("".concat(g.length, " results found")), e(d), b(g)
                    })["catch"](function (a) {
                        c("".concat(a.name, " : ").concat(a.message))
                    })
                })["catch"](function (a) {
                    c("".concat(a.name, " : ").concat(a.message))
                });
                else if (MediaStreamTrack && MediaStreamTrack.getSources) {
                    a._log("MediaStreamTrack.getSources used");
                    var d = function (c) {
                        for (var d, e = [], f = 0; f !== c.length; ++f) d = c[f], "video" === d.kind && e.push({
                            id: d.id,
                            label: d.label
                        });
                        a._log("".concat(e.length, " results found")), b(e)
                    };
                    MediaStreamTrack.getSources(d)
                } else a._log("unable to query supported devices."), c("unable to query supported devices.")
            })
        }
    }, {
        key: "_getTimeoutFps",
        value: function (a) {
            return 1e3 / a
        }
    }, {
        key: "_log",
        value: function (b) {
            a.VERBOSE && console.log(b)
        }
    }]), a
}();
_defineProperty(Html5Qrcode, "DEFAULT_WIDTH", 300), _defineProperty(Html5Qrcode, "DEFAULT_WIDTH_OFFSET", 2), _defineProperty(Html5Qrcode, "FILE_SCAN_MIN_HEIGHT", 300), _defineProperty(Html5Qrcode, "SCAN_DEFAULT_FPS", 2), _defineProperty(Html5Qrcode, "MIN_QR_BOX_SIZE", 50), _defineProperty(Html5Qrcode, "SHADED_LEFT", 1), _defineProperty(Html5Qrcode, "SHADED_RIGHT", 2), _defineProperty(Html5Qrcode, "SHADED_TOP", 3), _defineProperty(Html5Qrcode, "SHADED_BOTTOM", 4), _defineProperty(Html5Qrcode, "SHADED_REGION_CLASSNAME", "qr-shaded-region"), _defineProperty(Html5Qrcode, "VERBOSE", !1), _defineProperty(Html5Qrcode, "BORDER_SHADER_DEFAULT_COLOR", "#ffffff"), _defineProperty(Html5Qrcode, "BORDER_SHADER_MATCH_COLOR", "rgb(90, 193, 56)");
var Html5QrcodeScanner = function () {
    function a(b, c, d) {
        if (_classCallCheck(this, a), this.elementId = b, this.config = c, this.verbose = !0 === d, !document.getElementById(b)) throw "HTML Element with id=".concat(b, " not found");
        this.currentScanType = a.SCAN_TYPE_CAMERA, this.sectionSwapAllowed = !0, this.section = void 0, this.html5Qrcode = void 0, this.qrCodeSuccessCallback = void 0, this.qrCodeErrorCallback = void 0
    }
    return _createClass(a, [{
        key: "render",
        value: function (b, c) {
            var d = this;
            this.lastMatchFound = void 0, this.qrCodeSuccessCallback = function (c) {
                if (d.__setStatus("MATCH", a.STATUS_SUCCESS), b) b(c);
                else {
                    if (d.lastMatchFound == c) return;
                    d.lastMatchFound = c, d.__setHeaderMessage("Last Match: ".concat(c), a.STATUS_SUCCESS)
                }
            }, this.qrCodeErrorCallback = function (a) {
                d.__setStatus("Scanning"), c && c(a)

            };
            var e = document.getElementById(this.elementId);
            e.innerHTML = "", this.__createBasicLayout(e), this.html5Qrcode = new Html5Qrcode(this.__getScanRegionId(), this.verbose)
        }
    }, {
        key: "clear",
        value: function () {
            var a = this,
                b = this,
                c = function () {
                    var b = document.getElementById(a.elementId);
                    b && (b.innerHTML = "")
                };
            this.html5Qrcode && this.html5Qrcode._isScanning() && this.html5Qrcode.stop().then(function () {
                b.html5Qrcode.clear(), c()
            })["catch"](function (a) {
                b.verbose && console.error("Unable to stop qrcode scanner", a), b.html5Qrcode.clear(), c()
            })
        }
    }, {
        key: "__createBasicLayout",
        value: function (a) {
            a.style.position = "relative", a.style.padding = "0px", a.style.border = "1px solid silver", this.__createHeader(a);
            var b = document.createElement("div"),
                c = this.__getScanRegionId();
            //[DRS] Apply Sceens minHeight 56vh and width 100% screen size
            b.id = c, b.style.width = "100%", b.style.minHeight = "56vh", b.style.textAlign = "center", a.appendChild(b), this.__insertCameraScanImageToScanRegion();
            var d = document.createElement("div"),
                e = this.__getDashboardId();
            d.id = e, d.style.width = "100%", a.appendChild(d), this.__setupInitialDashboard(d)
        }
    }, {
        key: "__setupInitialDashboard",
        value: function (a) {
            this.__createSection(a), this.__createSectionControlPanel(), this.__createSectionSwap()
        }
    }, {
        key: "__createHeader",
        value: function (a) {
            var b = document.createElement("div");
            b.id = 'headerIDs' //[DRS] apply id for hide external div section for scanner section
            b.style.textAlign = "left", b.style.margin = "0px", b.style.padding = "5px", b.style.fontSize = "20px", b.style.borderBottom = "1px solid rgba(192, 192, 192, 0.18)", a.appendChild(b);
            // var c = document.createElement("span");
            // c.classList.add("header-color")
            // c.style.color = '#273c88'
            // c.innerHTML = "Sepio - 2 Factor Authentication", b.appendChild(c);
            var d = document.createElement("span");
            d.id = this.__getStatusSpanId(), d.style.float = "right", d.style.padding = "5px 7px", d.style.fontSize = "14px", d.style.background = "#dedede6b", d.style.border = "1px solid #00000000", d.style.color = "rgb(17, 17, 17)", b.appendChild(d), this.__setStatus("IDLE");
            var e = document.createElement("div");
            e.id = this.__getHeaderMessageContainerId(), e.style.display = "none", e.style.fontSize = "14px", e.style.padding = "2px 10px", e.style.marginTop = "4px", e.style.borderTop = "1px solid #f6f6f6", b.appendChild(e)
        }
    }, {
        key: "__createSection",
        value: function (a) {
            var b = document.createElement("div");
            b.id = this.__getDashboardSectionId(), b.style.width = "100%", b.style.padding = "10px", b.style.textAlign = "left", a.appendChild(b)
        }
    }, {
        key: "__createSectionControlPanel",
        value: function () {
            let renderDashboard = document.getElementById('reader__dashboard');
            renderDashboard.style.display = 'none';
            let renderDashboardSection = document.getElementById('reader__dashboard_section');
            renderDashboardSection.style.display = 'none'
            let renderStatusSection = document.getElementById('headerIDs');
            renderStatusSection.style.display = 'none'
            var b = this,
                c = document.getElementById(this.__getDashboardSectionId()),
                d = document.createElement("div");
            c.appendChild(d);
            var e = document.createElement("div");
            e.id = this.__getDashboardSectionCameraScanRegionId(), e.style.display = this.currentScanType == a.SCAN_TYPE_CAMERA ? "block" : "none", d.appendChild(e);
            var f = document.createElement("div");
            f.style.textAlign = "center";
            var g = document.createElement("button");
            g.style.color = 'white';
            g.style.bordercolor = 'transparent';
            g.style.border = "0px";
            g.style.backgroundColor = 'white';
            g.innerHTML = "Request Camera Permissions", window.addEventListener("load", function () {
                g.disabled = !0, b.__setStatus("PERMISSION"), b.__setHeaderMessage("Requesting camera permissions..."), Html5Qrcode.getCameras().then(function (c) {
                    b.__setStatus("IDLE"), b.__resetHeaderMessage(), c && 0 != c.length ? (e.removeChild(f), b.__renderCameraSelection(c)) : b.__setStatus("No Cameras", a.STATUS_WARNING)
                })["catch"](function (c) {
                    g.disabled = !1, b.__setStatus("IDLE"), b.__setHeaderMessage(c, a.STATUS_WARNING)
                })
            }), f.appendChild(g), e.appendChild(f);
            var h = document.createElement("div");
            h.id = this.__getDashboardSectionFileScanRegionId(), h.style.textAlign = "center", h.style.display = this.currentScanType == a.SCAN_TYPE_CAMERA ? "none" : "block", d.appendChild(h);
            var i = document.createElement("input");
            i.id = this.__getFileScanInputId(), i.accept = "image/*", i.type = "file", i.style.width = "200px", i.disabled = this.currentScanType == a.SCAN_TYPE_CAMERA;
            var j = document.createElement("span");
            j.innerHTML = "&nbsp; Select Image", h.appendChild(i), h.appendChild(j), i.addEventListener("change", function (c) {
                if (b.currentScanType === a.SCAN_TYPE_FILE && 0 != c.target.files.length) {
                    var d = c.target.files[0];
                    b.html5Qrcode.scanFile(d, !0).then(b.qrCodeSuccessCallback)["catch"](function (c) {
                        b.__setStatus("ERROR", a.STATUS_WARNING), b.__setHeaderMessage(c, a.STATUS_WARNING)
                    })
                }
            })
        }
    }, {
        key: "__renderCameraSelection",
        value: function (b) {
            var c = this,
                d = document.getElementById(this.__getDashboardSectionCameraScanRegionId());
            d.style.textAlign = "center";
            var e = document.createElement("span");
            //[DS] - To remove the text "Select Camera"
            //e.innerHTML = "Select Camera (".concat(b.length, ") &nbsp;"), e.style.marginRight = "10px";           
            e.innerHTML = "";
            var f = document.createElement("select");

            //[DS] - To make the drop down disappear (by changing its color to white)
            f.style.color = 'white';
            f.style.bordercolor = 'transparent';
            f.style.border = "0px";
            f.style.backgroundColor = 'white';
            f.id = this.__getCameraSelectionId();
            for (var g = 0; g < b.length; g++) {
                //This if condition ensures that the camera always gets 1 value - back camera
                if (b[g].label.includes("back") || b[g].label.includes("Back")) {
                    var h = b[g],
                        j = h.id,
                        k = null == h.label ? j : h.label,
                        l = document.createElement("option")
                    l.value = j, l.innerHTML = k, f.appendChild(l)
                }
                else { }
            }
            e.appendChild(f), d.appendChild(e);
            //Removing start scanning and stop scanning button            
            //var m = document.createElement("span"),
            //    n = document.createElement("button");
            //n.innerHTML = "Start Scanning", m.appendChild(n);
            //o = document.createElement("button");
            //o.innerHTML = "Stop Scanning", o.style.display = "none", o.disabled = !0, m.appendChild(o), d.appendChild(m); 
            f.disabled = !0, c._showHideScanTypeSwapLink(!1);
            var b = c.config ? c.config : {
                fps: 10,
                qrbox: 250
            },
                d = f.value;
            c.html5Qrcode.start(d, b, c.qrCodeSuccessCallback, c.qrCodeErrorCallback).then(function () {
                c.__setStatus("Scanning")
            })["catch"](function (b) {
                c._showHideScanTypeSwapLink(!0), f.disabled = !1, c.__setStatus("IDLE"), c.__setHeaderMessage(b, a.STATUS_WARNING)
            })

        }
    }, {
        key: "__createSectionSwap",
        value: function () {
            var b = this,
                c = "",
                d = "",
                e = document.getElementById(this.__getDashboardSectionId()),
                f = document.createElement("div");
            f.style.textAlign = "center";
            var g = document.createElement("a");
            g.style.textDecoration = "underline", g.id = this.__getDashboardSectionSwapLinkId(), g.innerHTML = this.currentScanType == a.SCAN_TYPE_CAMERA ? c : d, g.href = "#scan-using-file", g.addEventListener("click", function () {
                return b.sectionSwapAllowed ? void (b.sectionSwapAllowed = !1, b.currentScanType == a.SCAN_TYPE_CAMERA ? (b.__clearScanRegion(), b.__getFileScanInput().disabled = !1, b.__getCameraScanRegion().style.display = "none", b.__getFileScanRegion().style.display = "block", g.innerHTML = d, b.currentScanType = a.SCAN_TYPE_FILE, b.__insertFileScanImageToScanRegion()) : (b.__clearScanRegion(), b.__getFileScanInput().disabled = !0, b.__getCameraScanRegion().style.display = "block", b.__getFileScanRegion().style.display = "none", g.innerHTML = c, b.currentScanType = a.SCAN_TYPE_CAMERA, b.__insertCameraScanImageToScanRegion()), b.sectionSwapAllowed = !0) : void (b.verbose && console.error("Section swap called when not allowed"))
            }), f.appendChild(g), e.appendChild(f)
        }
    }, {
        key: "__setStatus",
        value: function (b, c) {
            c || (c = a.STATUS_DEFAULT);
            var d = document.getElementById(this.__getStatusSpanId());

            switch (d.innerHTML = b, c) {
                case a.STATUS_SUCCESS:
                    d.style.background = "#6aaf5042", d.style.color = "#477735";
                    break;
                case a.STATUS_WARNING:
                    d.style.background = "#cb243124", d.style.color = "#cb2431";
                    break;
                case a.STATUS_DEFAULT:
                default:
                    d.style.background = "#eef", d.style.color = "rgb(17, 17, 17)";
            }

        }
    }, {
        key: "__resetHeaderMessage",
        value: function () {
            var a = document.getElementById(this.__getHeaderMessageContainerId());
            a.style.display = "none"
        }
    }, {
        key: "__setHeaderMessage",
        value: function (b, c) {
            c || (c = a.STATUS_DEFAULT);
            var d = document.getElementById(this.__getHeaderMessageContainerId());
            switch (d.innerHTML = b, d.style.display = "block", c) {
                case a.STATUS_SUCCESS:
                    d.style.background = "#6aaf5042", d.style.color = "#477735";
                    break;
                case a.STATUS_WARNING:
                    d.style.background = "#cb243124", d.style.color = "#cb2431";
                    break;
                case a.STATUS_DEFAULT:
                default:
                    d.style.background = "#00000000", d.style.color = "rgb(17, 17, 17)";
            }
        }
    }, {
        key: "_showHideScanTypeSwapLink",
        value: function (a) {
            !0 !== a && (a = !1), this.sectionSwapAllowed = a, this.__getDashboardSectionSwapLink().style.display = a ? "inline-block" : "none"
        }
    }, {
        key: "__insertCameraScanImageToScanRegion",
        value: function () {
            var b = this,
                c = document.getElementById(this.__getScanRegionId());
            return this.cameraScanImage ? (c.innerHTML = "<br>", void c.appendChild(this.cameraScanImage)) : void (this.cameraScanImage = new Image, this.cameraScanImage.onload = function () {
                c.innerHTML = "<br>", c.appendChild(b.cameraScanImage)
            }, this.cameraScanImage.width = 64, this.cameraScanImage.style.opacity = .3, this.cameraScanImage.src = a.ASSET_CAMERA_SCAN)
        }
    }, {
        key: "__insertFileScanImageToScanRegion",
        value: function () {
            var b = this,
                c = document.getElementById(this.__getScanRegionId());
            return this.fileScanImage ? (c.innerHTML = "<br>", void c.appendChild(this.fileScanImage)) : void (this.fileScanImage = new Image, this.fileScanImage.onload = function () {
                c.innerHTML = "<br>", c.appendChild(b.fileScanImage)
            }, this.fileScanImage.width = 64, this.fileScanImage.style.opacity = .3, this.fileScanImage.src = a.ASSET_FILE_SCAN)
        }
    }, {
        key: "__clearScanRegion",
        value: function () {
            var a = document.getElementById(this.__getScanRegionId());
            a.innerHTML = ""
        }
    }, {
        key: "__getDashboardSectionId",
        value: function () {
            return "".concat(this.elementId, "__dashboard_section")
        }
    }, {
        key: "__getDashboardSectionCameraScanRegionId",
        value: function () {
            return "".concat(this.elementId, "__dashboard_section_csr")
        }
    }, {
        key: "__getDashboardSectionFileScanRegionId",
        value: function () {
            return "".concat(this.elementId, "__dashboard_section_fsr")
        }
    }, {
        key: "__getDashboardSectionSwapLinkId",
        value: function () {
            return "".concat(this.elementId, "__dashboard_section_swaplink")
        }
    }, {
        key: "__getScanRegionId",
        value: function () {
            return "".concat(this.elementId, "__scan_region")
        }
    }, {
        key: "__getDashboardId",
        value: function () {
            return "".concat(this.elementId, "__dashboard")
        }
    }, {
        key: "__getFileScanInputId",
        value: function () {
            return "".concat(this.elementId, "__filescan_input")
        }
    }, {
        key: "__getStatusSpanId",
        value: function () {
            return "".concat(this.elementId, "__status_span")
        }
    }, {
        key: "__getHeaderMessageContainerId",
        value: function () {
            return "".concat(this.elementId, "__header_message")
        }
    }, {
        key: "__getCameraSelectionId",
        value: function () {
            return "".concat(this.elementId, "__camera_selection")
        }
    }, {
        key: "__getCameraScanRegion",
        value: function () {
            return document.getElementById(this.__getDashboardSectionCameraScanRegionId())
        }
    }, {
        key: "__getFileScanRegion",
        value: function () {
            return document.getElementById(this.__getDashboardSectionFileScanRegionId())
        }
    }, {
        key: "__getFileScanInput",
        value: function () {
            return document.getElementById(this.__getFileScanInputId())
        }
    }, {
        key: "__getDashboardSectionSwapLink",
        value: function () {
            return document.getElementById(this.__getDashboardSectionSwapLinkId())
        }
    }]), a
}();

// https://raw.githubusercontent.com/mebjas/html5-qrcode/master/assets/camera-scan.gif
_defineProperty(Html5QrcodeScanner, "SCAN_TYPE_CAMERA", "SCAN_TYPE_CAMERA"), _defineProperty(Html5QrcodeScanner, "SCAN_TYPE_FILE", "SCAN_TYPE_FILE"), _defineProperty(Html5QrcodeScanner, "STATUS_SUCCESS", "STATUS_SUCCESS"), _defineProperty(Html5QrcodeScanner, "STATUS_WARNING", "STATUS_WARNING"), _defineProperty(Html5QrcodeScanner, "STATUS_DEFAULT", "STATUS_DEFAULT"), _defineProperty(Html5QrcodeScanner, "ASSET_FILE_SCAN", "https://raw.githubusercontent.com/mebjas/html5-qrcode/master/assets/file-scan.gif"), _defineProperty(Html5QrcodeScanner, "ASSET_CAMERA_SCAN", "");

//[DRS] Function to check decoded QR is genuine or Fake
function checkGenuineOrFakeProduct(scanText) {

    if(isAPIResponse){

        // $('#loader').modal('show')

    scanQRText = scanText;
    scanQRText = scanQRText.trim()
    console.log("Scan Text", scanQRText);

    // console.log("before sent Code Word : " + Final_CodeWord);
    // console.log("Final Version No", finalVersionNo);
    // console.log("Mask Type", finalMask);
    // console.log("ECC level", ECC_Level);
    // // Define the URL of your Django server
        isAPIResponse=false;
    
    // Define the data you want to send in the POST request (as a JavaScript object)
    const postData = {
        "client_secret_key": client_secret_key,
        "uid_url": scanQRText,
        "codeword": Final_CodeWord,
        "qr_version": finalVersionNo,
        "mask_type": finalMask,
        "ecc_level": ECC_Level
    }

    // Create an options object for the fetch request
    console.log(postData)
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(postData), // Convert the data to JSON format
    };

    // Make the POST request using fetch
    fetch(djangoServerUrl, requestOptions)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then((data) => {
            // Handle the response data here
            console.log(data.resultdata);
            // $('#loader').modal('hide')

            localStorage.removeItem("sessiondata");
            if (data.resultdata.result_code =="200" || data.resultdata.result_code ==200){
                $('#exampleModal').modal('show');
                localStorage.setItem("sessiondata",JSON.stringify({"client_secret_key":client_secret_key,"isvalidkey":true}));
                let genuineIconEle = document.getElementById('genuineIconID');
                genuineIconEle.style.display = 'block';
                let fakeIconEle = document.getElementById('fakeIconID');
                fakeIconEle.style.display = 'none';
                let genuineOrfake = document.getElementById('productGenuineOrFake');
                genuineOrfake.style.color = 'green';
                genuineOrfake.innerText = data.resultdata.message;

        }else if(data.resultdata.result_code== 402 || data.resultdata.result_code=="402"){
            localStorage.setItem("sessiondata",JSON.stringify({"client_secret_key":client_secret_key,"isvalidkey":false}));
            $('#exampleModal1').modal('show');

            document.getElementById("clientkeymesg").textContent="Client key InValid"

        }
            else{
                $('#exampleModal').modal('show');

                localStorage.setItem("sessiondata",JSON.stringify({"client_secret_key":client_secret_key,"isvalidkey":true}));
                let genuineIconEle = document.getElementById('genuineIconID');
                genuineIconEle.style.display = 'none';
                let fakeIconEle = document.getElementById('fakeIconID');
                fakeIconEle.style.display = 'block';
                let genuineOrfake = document.getElementById('productGenuineOrFake');
                genuineOrfake.style.color = '#ff3737';
                genuineOrfake.innerText = data.resultdata.message
            }
            
            isGenuineOrFakeModalOpen = true;
            isAPIResponse=true;
        })
        .catch((error) => {
        // $('#loader').modal('hide')
            

            // Handle any errors that occurred during the fetch
            console.error('There was a problem with the fetch operation:', error);
        });
    }

}
function refreshModal() {
    
    isGenuineOrFakeModalOpen = false;
    // let genuineIconEle = document.getElementById('genuineIconID');
    // genuineIconEle.style.display = 'none';
    // let fakeIconEle = document.getElementById('fakeIconID');
    // fakeIconEle.style.display = 'none';
    location.reload();
}



// **********|CODE TO PREVENT SCREEN ROTATION|*************



function handleOrientationChange() {
    if (window.orientation === 90 || window.orientation === -90) {
        // Landscape orientation
        $('#screenrotate').modal('show');
    } else {
        // Portrait orientation
        // refreshModal()
        $('#screenrotate').modal('hide');


    }
}
window.addEventListener("orientationchange", handleOrientationChange);







