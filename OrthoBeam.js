// Function to create a beam perpendicular to two straight beams in space, which is also the shortest beam that joins them
// For skew lines (3 arguments):
//   Condition 1: The reference lines are not co-planar
//   Condition 2: The extension of the reference lines encompases the points where the new line intersects them
// For co-planar lines (5 arguments):
//   Condition 1: The reference lines are not skew
//   Condition 2: The axis plane at the specified position intersects Beam1
//   Condition 3: The shortest line between Beam1 at the specified position and Beam2 intersects Beam2 in its range
// Examples at the end
function OrthoBeam (Name, Beam1, Beam2, Axis, Position) {
// Arguments: 'Name of the new beam', Name of the first reference beam, Name of the second reference beam, ['Axis', Position]
  a1 = (Beam1.end2.x - Beam1.end1.x);
  b1 = (Beam1.end2.y - Beam1.end1.y);
  c1 = (Beam1.end2.z - Beam1.end1.z);
  a2 = (Beam2.end1.x - Beam1.end1.x);
  b2 = (Beam2.end1.y - Beam1.end1.y);
  c2 = (Beam2.end1.z - Beam1.end1.z);
  a = (b1 * c2 - b2 * c1).toDouble();
  b = (a2 * c1 - a1 * c2).toDouble();
  c = (a1 * b2 - b1 * a2).toDouble();
  d = (-a * Beam1.end1.x.toDouble() - b * Beam1.end1.y.toDouble() - c * Beam1.end1.z.toDouble());
	// Now this condition uses a tolerance:
	if (Math.abs(a * Beam2.end2.x.toDouble() + b * Beam2.end2.y.toDouble() + c * Beam2.end2.z.toDouble() + d) < 0.000001) { // If the lines are co-planar
		A = 0;
		if        ((Axis == "x" || Axis == "X") && Position >= Math.min(Beam1.end1.x, Beam1.end2.x) && Position <= Math.max(Beam1.end1.x, Beam1.end2.x)) {
			A = Point(Beam1.intersect(XPlane3d(Position)));
		} else if ((Axis == "y" || Axis == "Y") && Position >= Math.min(Beam1.end1.y, Beam1.end2.y) && Position <= Math.max(Beam1.end1.y, Beam1.end2.y)) {
			A = Point(Beam1.intersect(YPlane3d(Position)));
		} else if ((Axis == "z" || Axis == "Z") && Position >= Math.min(Beam1.end1.z, Beam1.end2.z) && Position <= Math.max(Beam1.end1.z, Beam1.end2.z)) {
			A = Point(Beam1.intersect(ZPlane3d(Position)));
		}
		if (A == 0) {
			if ((Axis == "x" || Axis == "X" || Axis == "y" || Axis == "Y" || Axis == "z" || Axis == "Z") && Math.abs(Position.toDouble()) >= 0) {
				print("(200) 'OrthoBeam' DIDN'T CREATE A BEAM: THE AXIS PLANE AT THE SPECIFIED POSITION DOES NOT INTERSECT Beam1");
			} else {
				print("(100) 'OrthoBeam' DIDN'T CREATE A BEAM: 'Axis' OR 'Position' NOT SET OR NOT SET PROPERLY FOR CO-PLANAR LINES... SYNTAX: OrthoBeam ('Name', Beam1, Beam2, 'Axis', Position)");
			}
		} else {
			x_A = Beam2.end1.x;
			y_A = Beam2.end1.y;
			z_A = Beam2.end1.z;
			x_B = Beam2.end2.x;
			y_B = Beam2.end2.y;
			z_B = Beam2.end2.z;
			x_P = A.x;
			y_P = A.y;
			z_P = A.z;
			//
			t_1 = x_A * x_A - x_A * (x_B + x_P) + x_B * x_P + y_A * y_A - y_A * y_B - y_A * y_P + y_B * y_P + z_A * z_A - z_A * z_B - z_A * z_P + z_B * z_P;
			t_2 = x_A * x_A - 2 * x_A * x_B + x_B * x_B + y_A * y_A - 2 * y_A * y_B + y_B * y_B + z_A * z_A - 2 * z_A * z_B + z_B * z_B;
			t = t_1.toDouble() / t_2.toDouble();
			//
			B = point(x_A + (x_B - x_A) * t, y_A + (y_B - y_A) * t, z_A + (z_B - z_A) * t);
		  //
			if (B.x < Math.min(x_A, x_B) || B.x > Math.max(x_A, x_B) ||
			    B.y < Math.min(y_A, y_B) || B.y > Math.max(y_A, y_B) ||
			    B.z < Math.min(z_A, z_B) || B.z > Math.max(z_A, z_B)) { // Range check for reference lines
				print("(300) 'OrthoBeam' DIDN'T CREATE A BEAM: THE LINE WITH THE SHORTEST DISTANCE FROM THE SELECTED POINT IN Beam1 DOES NOT INTERSECT Beam2 IN ITS RANGE");
			} else {
		  	newBeam = StraightBeam(A, B);
				newBeam.name = Name;
			}
	  }
	} else {
		U = Vector3d(Beam1.end1, Beam1.end2);
		V = Vector3d(Beam2.end1, Beam2.end2);
		//
		i = U.Dot(U).toDouble();
		j = U.Dot(V).toDouble();
		k = V.Dot(V).toDouble();
		//
		m = (U.x * (Beam2.end1.x - Beam1.end1.x) + 
		     U.y * (Beam2.end1.y - Beam1.end1.y) + 
		     U.z * (Beam2.end1.z - Beam1.end1.z)).toDouble(); // U dot (Q - P)
	  n = (V.x * (Beam2.end1.x - Beam1.end1.x) + 
	       V.y * (Beam2.end1.y - Beam1.end1.y) + 
	       V.z * (Beam2.end1.z - Beam1.end1.z)).toDouble(); // V dot (Q - P)
	  //
	  s = ( j * n - k * m)/(math.pow(j, 2.0) - i * k);
	  t = (-j * m + i * n)/(math.pow(j, 2.0) - i * k);
	  //
	  A = point((Beam1.end1.x + (s * U.x)).toDouble(), (Beam1.end1.y + (s * U.y)).toDouble(), (Beam1.end1.z + (s * U.z)).toDouble()); // P + sU
	  B = point((Beam2.end1.x + (t * V.x)).toDouble(), (Beam2.end1.y + (t * V.y)).toDouble(), (Beam2.end1.z + (t * V.z)).toDouble()); // Q + tV
	  //
	  if (A.x > Math.max(Beam1.end1.x, Beam1.end2.x) ||
	  		A.x < Math.min(Beam1.end1.x, Beam1.end2.x) ||
	  		B.x > Math.max(Beam2.end1.x, Beam2.end2.x) ||
	  		B.x < Math.min(Beam2.end1.x, Beam2.end2.x) ||
	  		A.y > Math.max(Beam1.end1.y, Beam1.end2.z) ||
	  		A.y < Math.min(Beam1.end1.y, Beam1.end2.z) ||
	  		B.y > Math.max(Beam2.end1.y, Beam2.end2.z) ||
	  		B.y < Math.min(Beam2.end1.y, Beam2.end2.z)) { // Range check for reference lines (checking for 2 axes covers all non co-planar configurations)
			print("(400) 'OrthoBeam' DIDN'T CREATE A BEAM: THE LINE PERPENDICULAR TO THE TWO REFERENCE LINES IS OUTSIDE THE RANGE OF AT LEAST ONE OF THEM");
		} else {
		  newBeam = StraightBeam(A, B);
			newBeam.name = Name;
		}
	}
}
// Examples:
//   Skew lines:
//     OrthoBeam('J01S10',J01_04,H0631)           <----- will create the only possible beam that is orthogonal to both J01_04 and H0631
//   Co-planar lines:
//     OrthoBeam('C03S04',LA1_11,C03_02,'z',14 m) <----- will create the shortest beam between LA1_11(Z = 14 m) and C03_02 
