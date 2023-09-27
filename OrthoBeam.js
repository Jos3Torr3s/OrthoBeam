// Function to create a beam perpendicular to two straight beams in space, which is also the shortest beam that joins them
// Condition 1: The reference lines are skew, i.e., non coplanar and non parellel
// Condition 2: The extension of the reference lines encompases the points where the new line intersects them
// If the conditions are not met, no error will be returned, but a beam will not be created
function OrthoBeam (Name, Beam1, Beam2) {
// Arguments: 'Name of the new beam', 'Name of the first reference beam', 'Name of the second reference beam'
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

	if (a * Beam2.end2.x.toDouble() + b * Beam2.end2.y.toDouble() + c * Beam2.end2.z.toDouble() + d == 0) { // Coplanarity check
	    	
		print("'OrthoBeam' DIDN'T CREATE SEGMENT: REFERENCE LINES ARE CO-PLANAR");
		
	} else {
	
		U = Vector3d(Beam1.end1, Beam1.end2);
		V = Vector3d(Beam2.end1, Beam2.end2);
		
		i = U.Dot(U).toDouble();
		j = U.Dot(V).toDouble();
		k = V.Dot(V).toDouble();
		
		m = (U.x * (Beam2.end1.x - Beam1.end1.x) + 
		     U.y * (Beam2.end1.y - Beam1.end1.y) + 
		     U.z * (Beam2.end1.z - Beam1.end1.z)).toDouble(); // U dot (Q - P)
	  n = (V.x * (Beam2.end1.x - Beam1.end1.x) + 
	       V.y * (Beam2.end1.y - Beam1.end1.y) + 
	       V.z * (Beam2.end1.z - Beam1.end1.z)).toDouble(); // V dot (Q - P)
	  
	  s = ( j * n - k * m)/(math.pow(j, 2.0) - i * k);
	  t = (-j * m + i * n)/(math.pow(j, 2.0) - i * k);
	  
	  A = point((Beam1.end1.x + (s * U.x)).toDouble(), (Beam1.end1.y + (s * U.y)).toDouble(), (Beam1.end1.z + (s * U.z)).toDouble()); // P + sU
	  B = point((Beam2.end1.x + (t * V.x)).toDouble(), (Beam2.end1.y + (t * V.y)).toDouble(), (Beam2.end1.z + (t * V.z)).toDouble()); // Q + tV
	  
	  if (A.x > Math.max(Beam1.end1.x, Beam1.end2.x) ||
	  		A.x < Math.min(Beam1.end1.x, Beam1.end2.x) ||
	  		B.x > Math.max(Beam2.end1.x, Beam2.end2.x) ||
	  		B.x < Math.min(Beam2.end1.x, Beam2.end2.x)) { // Reference line lenght check
		
			print("'OrthoBeam' DIDN'T CREATE SEGMENT: THE LINE PERPENDICULAR TO THE TWO REFERENCE LINES IS OUTSIDE THEIR RANGE");
		
		} else {
			
		  newBeam = StraightBeam(A, B);
			newBeam.name = Name;
			
		}
		
	}

}
