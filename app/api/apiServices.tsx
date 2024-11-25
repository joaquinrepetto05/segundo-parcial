// Devolver todos los equipos
export const getTeams = async () => {
    const URL = "http://161.35.143.238:8000/jrepetto";
    try {
        const response = await fetch(URL);
        if (response.ok) {
            const data = await response.json();
            console.log("Datos de la API:", data);
            return data;
        } else {
            console.log("Error getting info");
            return [];
        }
    } catch (error) {
        console.error(error);
    }
};

// Devolver el equipo por ID
export const getTeamById = async (id: string) => {
    const URL = `http://161.35.143.238:8000/jrepetto/${id}`;
    try {
        const response = await fetch(URL);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.log("Error getting info");
            return [];
        }
    } catch (error) {
        console.error(error);
    }
};

// Agregar un nuevo equipo
export const addTeam = async (team: { name: string, description: string, logo: string }) => {
    const URL = "http://161.35.143.238:8000/jrepetto";
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(team),
        });

        if (response.ok) {
            return true;
        } else {
            console.log('Error al agregar el equipo');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};


// Eliminar equipo por ID
export const deleteTeamById = async (id: string) => {
    const URL = `http://161.35.143.238:8000/jrepetto/${id}`;
    try {
        const response = await fetch(URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            return true;
        } else {
            console.log('Error al eliminar el equipo');
            return false;
        }
    } catch (error) {
        console.error('Error de red:', error);
        return false;
    }
};

// Actualizar equipo por ID
export const updateTeam = async (id: string, updatedTeam: { description: string, goals: string, points: string }) => {
    const URL = `http://161.35.143.238:8000/jrepetto/${id}`;
    try {
      const response = await fetch(URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTeam),
      });
  
      if (response.ok) {
        return true;
      } else {
        console.log('Error al actualizar el equipo');
        return false;
      }
    } catch (error) {
      console.error('Error de red:', error);
      return false;
    }
  };  